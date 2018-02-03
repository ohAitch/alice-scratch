
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#define p printf
void len(short n){
  putchar(0xff & (n>>8));
  putchar(0xff & n);
}
void str(char *s){
  p("y"), len(strlen(s)), p("%s",s);
}
char tty(int n){ return 0xf4 | isatty(n);}
int main(int argc, char *argv[], char *env[]){
  p("\xa4"),
    p("dargv"), p("\x99"), len(argc);
      for(;*argv != 0; argv++) str(*argv);
    p("ccwd"), str(getcwd(NULL,0));
    p("eisTTY"), p("\x83%c%c%c", tty(0), tty(1), tty(2));
    p("cenv"), p("\x9f");
       for(;*env != 0; env++) str(*env);
       p("\xff");
//  char **argv_ = malloc(argc+3);
//  argv[0] = "node"; argv[1] = "-p"; argv[2] = "1+1"; argv[3] = 0;
//  execvp("node", argv_);
  //perror("execl");
}
