
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
FILE* runner;
#define p(...) fprintf(runner,__VA_ARGS__)
void len(short n){
  putc(0xff & (n>>8), runner);
  putc(0xff & n, runner);
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
  }
//
int main(int argc, char *argv[], char *env[]){
  runner = popen("./runner.js", "w");
  cborEnv(argc,argv,env);
  fflush(runner), pclose(runner);
  return 0;
}
