#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
FILE* RUNNER;
#define p(...) fprintf(RUNNER,__VA_ARGS__)
void len(short n){
  putc(0xff & (n>>8), RUNNER);
  putc(0xff & n, RUNNER);
}
void str(char *s){
  p("y"), len(strlen(s)), p("%s",s);
}
char tty(int n){ return 0xf4 | isatty(n);}
void cborEnv(int argc, char *argv[], char *env[]){
  p("\xa4"),
    p("dargv"), p("\x99"), len(argc);
      for(;*argv != 0; argv++) str(*argv);
    p("ccwd"), str(getcwd(NULL,0));
    p("eisTTY"), p("\x83%c%c%c", tty(0), tty(1), tty(2));
    p("cenv"), p("\x9f");
       for(;*env != 0; env++) str(*env);
       p("\xff");
  fflush(RUNNER);
  }
//
FILE* node_server(){
  int fd;
  if ((fd = socket(AF_UNIX,SOCK_STREAM,0)) == -1) { return NULL;}
    
  static struct sockaddr_un addr =
     {.sun_family = AF_UNIX, .sun_path = "/tmp/node-runner"};
  if(connect(fd, (struct sockaddr*)&addr, sizeof(addr)) == -1) return NULL;

  RUNNER = fdopen(fd,"w");
  return fdopen(fd,"r");
}
//
int main(int argc, char *argv[], char *env[]){
  FILE* output;
  if((output = node_server()) != NULL){
    cborEnv(argc,argv,env);
    size_t len; char* line;
    while((line = fgetln(output,&len)) != NULL){
      fwrite(line, len, 1, stdout);
    }
    if(feof(output)){return 0;}
    else {perror("[ipc_shell] read");}
  }
  else {
    // fall back to new exec spawn
    // REVIEW: print/log warning?
    RUNNER = popen("./runner.js", "w");
    cborEnv(argc,argv,env);
    fflush(RUNNER), pclose(RUNNER);
    return 0;
  }
}
