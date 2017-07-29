// not ζ-specific; boxed with ζ because I'm not using it for anything else & because the server is ζ-specific

// perf: excellent except ipc_shell.c makes too many calls to `send\(`, i think? to fix, batch the A,E,D,R messages together into an I init message

// message/chunk types:
// server -> client: 1 stdout, 2 stderr, X exit, S send stdin
// client -> server: A argv, E env, D cwd, R ready, H heartbeat, 0 stdin, . stdin eof

// its a shame that my refactoring broke things
// mb i just need to learn C
// i could ask conifer

#include <arpa/inet.h>
#include <netdb.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <sys/time.h>
#include <sys/types.h>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>

typedef int HANDLE;
typedef unsigned int SOCKET;

#ifdef __APPLE__
	#define SEND_FLAGS 0
#else
	#define SEND_FLAGS MSG_NOSIGNAL
#endif

#include "PORT"

#define SOCKET_FAILED 231
#define CONNECT_FAILED 230
#define UNEXPECTED_CHUNKTYPE 229
#define CONNECTION_BROKEN 227

int the_socket = 0; // connected to the server

// buffer used for receiving and writing output chunks
char bufzero[1];
#define buf_SIZE 2048
char buf[buf_SIZE];

// track whether server is ready to receive
int ready_to_send = 0;

void cleanup_and_exit(int status){ close(the_socket); exit(status); }

// Exits the client if the server ungracefully shut down the connection.
void handle_socket_close(){ cleanup_and_exit(CONNECTION_BROKEN); }

// Writes everything in the specified buffer to the specified socket handle.
int send_all(SOCKET s, char *buf, int L){
	int sent_n = 0; int todo_n = L; int n = 0;
	while(sent_n < L){
		n = send(s, buf+sent_n, todo_n, SEND_FLAGS);
		if (n == -1) break;
		sent_n += n; todo_n -= n; }
	return n==-1? 0 : sent_n; }
// Sends a chunk noting the specified payload size and chunk type.
void sendChunk(unsigned int size, char chunkType, char* buf){
	char header[5];
	header[0] = (size >> 24) & 0xff;
	header[1] = (size >> 16) & 0xff;
	header[2] = (size >>  8) & 0xff;
	header[3] =  size        & 0xff;
	header[4] = chunkType;

	int sent_n = send_all(the_socket, header, 5);
	if (sent_n != 0 && size > 0)
		sent_n = send_all(the_socket, buf, size);
	else if (sent_n == 0 && (chunkType != 'H' || !(errno == EPIPE || errno == ECONNRESET))){ perror("[ipc_shell] send"); handle_socket_close(); }
	}
// Sends a null-terminated string with the specified chunk type.
void sendText(char chunkType, char *text){ sendChunk(text ? strlen(text) : 0, chunkType, text); }
void sendVoid(char chunkType){ sendChunk(0, chunkType, bufzero); }
// Sends len bytes from buf to the server in a stdin chunk.
void sendStdin(char *buf, unsigned int L){ ready_to_send = 0; sendChunk(L, '0', buf); }

// Receives len bytes from the socket and copies them to the specified file descriptor. Used to route data to stdout or stderr on the client.
void recv_to_fd(HANDLE destFD, char *buf, unsigned long L){
	unsigned long got_n = 0;
	while (got_n < L){
		unsigned long todo_n = L - got_n;
		int todo_n_t = (buf_SIZE < todo_n) ? buf_SIZE : todo_n;
		int thisPass = recv(the_socket, buf, todo_n_t, MSG_WAITALL); if (thisPass == 0 || thisPass == -1){ perror("[ipc_shell] recv_fd"); handle_socket_close(); }; got_n += thisPass;
		int done_n = 0; while(done_n < thisPass){ int done_n_t = write(destFD, buf + done_n, thisPass - done_n); if (done_n_t == -1){ perror("[ipc_shell] write"); handle_socket_close(); }; done_n += done_n_t; }
		}
	}

unsigned long recv_to_buffer(unsigned long L){
	unsigned long got_n = 0;
	while(got_n < L){
		int thisPass = recv(the_socket, buf + got_n, L - got_n, MSG_WAITALL);
		if (thisPass == 0 || thisPass == -1){ perror("[ipc_shell] recv_buf"); handle_socket_close(); }
		got_n += thisPass;
		}; return got_n; }

// Processes an exit chunk from the server.  This is just a string containing the exit code in decimal format.
void process_exit(char *buf, unsigned long L){
	int got_n = recv_to_buffer((buf_SIZE - 1 < L) ? buf_SIZE - 1 : L); if (got_n < 0) handle_socket_close(); buf[got_n] = 0;
	cleanup_and_exit(atoi(buf)); }

// Reads from stdin and transmits it to the server in a stdin chunk. Sends a stdin-eof chunk if necessary.
int process_stdin(){
	int got_n = read(STDIN_FILENO, buf, buf_SIZE);
	if (got_n > 0) sendStdin(buf, got_n); else if (got_n == 0) sendVoid('.');
	return got_n; }

void process_the_stream(){unsigned long L; char ct;
	recv_to_buffer(5);
	L = ((buf[0] << 24) & 0xff000000)
		| ((buf[1] << 16) & 0x00ff0000)
		| ((buf[2] <<  8) & 0x0000ff00)
		| ((buf[3]      ) & 0x000000ff);
	ct = buf[4];
	switch(ct){default: fprintf(stderr, "[ipc_shell] unexpected chunk type %d ('%c')\n", ct, ct); cleanup_and_exit(UNEXPECTED_CHUNKTYPE);
		break; case '1': recv_to_fd(STDOUT_FILENO, buf, L);
		break; case '2': recv_to_fd(STDERR_FILENO, buf, L);
		break; case 'X': process_exit(buf, L);
		break; case 'S': ready_to_send = 1;
	}
	}

int intervalMillis(struct timeval end, struct timeval start){ return ((end.tv_sec - start.tv_sec) * 1000) + ((end.tv_usec - start.tv_usec) /1000); }

int main(int argc, char *argv[], char *env[]){
	int i;
	struct sockaddr *server_addr;
	socklen_t server_addr_len;
	struct sockaddr_in server_addr_in;
	char *cwd;
	struct hostent *hostinfo;

	fd_set readfds;
	int eof = 0;
	struct timeval readtimeout;

	// jump through a series of connection hoops

	hostinfo = gethostbyname("localhost");
	if (hostinfo == NULL){ fprintf(stderr, "[ipc_shell] gethostbyname failed\n"); cleanup_and_exit(CONNECT_FAILED); }
	if ((the_socket = socket(AF_INET, SOCK_STREAM, 0)) == -1){ perror("[ipc_shell] socket"); cleanup_and_exit(SOCKET_FAILED); }
	server_addr_in.sin_family = AF_INET;
	server_addr_in.sin_port = htons(PORT);
	server_addr_in.sin_addr = *(struct in_addr *) hostinfo->h_addr;
	memset(&(server_addr_in.sin_zero), '\0', 8);
	server_addr = (struct sockaddr *)&server_addr_in;
	server_addr_len = sizeof(server_addr_in);
	if (connect(the_socket, server_addr, server_addr_len) == -1){ perror("[ipc_shell] connect"); cleanup_and_exit(CONNECT_FAILED); }

	// ok, now we're connected.

	// send all of the command line arguments for the server
	for(i = 0; i < argc; ++i) sendText('A', argv[i]);
	// notify isatty for standard pipes
	for(i = 0; i < 3; i++){ char isattybuf[] = "NAILGUN_TTY_%d=%d"; sprintf(isattybuf, "NAILGUN_TTY_%d=%d", i, isatty(i)); sendText('E', isattybuf); }
	// forward the client process environment
	for(i = 0; env[i]; ++i) sendText('E', env[i]);
	// now send the working directory
	cwd = getcwd(NULL, 0); sendText('D', cwd); free(cwd);
	
	// this marks the point at which streams are linked between client and server.
	sendVoid('R');

	// stream forwarding loop
	for(;;){
		FD_ZERO(&readfds);
		if (ready_to_send && !eof) FD_SET(STDIN_FILENO, &readfds); // don't select on stdin if we've already reached its end
		FD_SET(the_socket, &readfds);
		memset(&readtimeout, '\0', sizeof(readtimeout)); readtimeout.tv_sec = 10; if (select(the_socket + 1, &readfds, NULL, NULL, &readtimeout) == -1) perror("[ipc_shell] select");
		if (FD_ISSET(the_socket, &readfds)) process_the_stream();
		else if (FD_ISSET(STDIN_FILENO, &readfds)){ int r = process_stdin(); if (r == -1){ perror("[ipc_shell] read"); handle_socket_close(); }; if (r == 0) eof = 1; }
		}
	}
