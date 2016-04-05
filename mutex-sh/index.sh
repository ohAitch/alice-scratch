#!/usr/bin/env bash
# Fernando Ipar -  2002 - fipar@acm.org
# file-system based mutual exclusion lock for shell scripts, with no active wait. this script is released under the GNU GPL. see the file COPYING for more info, or lynx to http://www.gnu.org
# edits and bugfixes by [second author @2016]

#! issue: forgetting to release and then randomly getting a new process with the same pid
	# should include smth like a mutex_release_ensure to watch for the process to end and release all of its orphaned mutexes then (and send an asynchronous error report to [who?])

[[ ${BASH_VERSION:0:1} = 4 ]] || { >&2 echo 'mutex-sh requires bash v4'; exit 1; }

_proc_exist(){ ps -p "$1" &>/dev/null; }
# _my_pid(){ [[ ${BASH_VERSION:0:1} = 4 ]] && echo $BASHPID || bash -c 'echo $PPID'; } # do not call from a subshell

_mutex_tmpd="/tmp/mutex_k7o"
_mutex_init(){ mkdir $_mutex_tmpd &>/dev/null; echo "$_mutex_tmpd/$(basename "$1")"; }

# attempts to obtain the file lock __with active wait__. i write my pid to the file to make sure i'm the owner of the lock
# returns 0 on success or 1 on deadlock detection
mutex_get(){ lock="$(_mutex_init "$1")"
	[ -f $lock ] && mutex_is_orphan $lock && rm -f $lock
	# add a new process to the 'queue'
	# this 'queue' is actually a set of files
	# i didn't use one single file and the >> redirection operator, precisely for mutual exclusion reasons, 
	# i have no way to prevent two processes waiting on the same lock to overwrite each other's pid if i append it to a single queue file. 
	[ -f $lock ] &&
		{ echo $BASHPID > "$lock-queue-$BASHPID"; : add myself to the queue; kill -SIGSTOP $BASHPID; : sleep on the lock; } ||
		{ echo $BASHPID > $lock
			sleep $( echo "scale=6; ${RANDOM}/1000000" | bc )
			# we only have some active wait if there's an inconsistency while attempting to obtain the lock
			[ $(cat $lock 2>/dev/null) -eq $BASHPID ] && return 0 || mutex_get $lock; }; }

# releases the lock. returns non-zero exit code if the client is not the owner of the lock
mutex_release(){ lock="$(_mutex_init "$1")"
	[ "$(cat $lock)" -eq $BASHPID ] && {
		waiting=$(find $_mutex_tmpd -type f -name "$(basename $lock)-queue-*" 2>/dev/null|head -1) # there is no real schedulling here...
		[ -z "$waiting" ] && rm -f $lock || { pid=$(cat $waiting); rm -f $waiting; : remove from queue; echo $pid > $lock; : grant him the lock; kill -SIGCONT $pid; : let him continue; }
		} || return 1; }

# verifies if the given lock exists, and if so, if it is an orphan lock (if the process that acquired it is no longer on the system)
export LOCK_FREE=4 # the lock is free, that is, the file does not exist
export LOCK_BUSY=3 # the lock is busy, that is, the file exists and the owner is running
export LOCK_ORPHAN=0 # the lock is busy, but the owner is no longer on the system
mutex_is_orphan(){ lock="$(_mutex_init "$1")"; [ -f $lock ] || return $LOCK_FREE; _proc_exist "$(cat $lock)" && return $LOCK_BUSY || return $LOCK_ORPHAN; }

# # returns the pid of the owner of the given lock (stdout) or a non-zero exit code if the lock does not exist
# mutex_owner(){ lock="$(_mutex_init "$1")"; [ -f $lock ] && echo $(cat $lock) || return 1; }
