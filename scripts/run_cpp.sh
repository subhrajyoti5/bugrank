#!/bin/bash
set -e

# Configuration
JOB_ID="$1"
TIME_LIMIT=5          # seconds
MEM_LIMIT=262144      # KB = 256MB
COMPILE_TIMEOUT=10    # seconds

JOB_DIR="/srv/bugpulse/jobs/$JOB_ID"
SRC="$JOB_DIR/main.cpp"
BIN="$JOB_DIR/a.out"
INPUT="$JOB_DIR/input.txt"
OUTPUT="$JOB_DIR/output.txt"
ERROR="$JOB_DIR/error.txt"
COMPILE_ERROR="$JOB_DIR/compile_error.txt"
STATUS="$JOB_DIR/status.txt"

cd "$JOB_DIR" || exit 1

# Compilation Phase
echo "COMPILING" > "$STATUS"
ulimit -t "$COMPILE_TIMEOUT"
ulimit -v "$MEM_LIMIT"

if ! g++ -std=c++17 -O2 -Wall -Wextra "$SRC" -o "$BIN" 2> "$COMPILE_ERROR"; then
  echo "CE" > "$STATUS"
  cat "$COMPILE_ERROR" > "$ERROR"
  exit 10
fi

# Execution Phase
echo "RUNNING" > "$STATUS"

# Run with time and resource limits
# --kill-after=2s: send SIGKILL 2s after SIGTERM if the process is still alive
# This prevents orphaned processes when the binary ignores SIGTERM (e.g. infinite loops)
set +e
(
  # Apply per-process CPU and memory limits inside a subshell
  ulimit -t "$TIME_LIMIT"
  ulimit -v "$MEM_LIMIT"
  exec /usr/bin/time -f "%e %M" \
    timeout --kill-after=2s "$TIME_LIMIT"s \
    "$BIN" < "$INPUT" > "$OUTPUT" 2>> "$ERROR"
)

EXIT_CODE=$?
set -e

# Belt-and-suspenders: kill any lingering process still running this binary
pkill -KILL -f "$BIN" 2>/dev/null || true

# Determine status
if [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 137 ]; then
  echo "TLE" > "$STATUS"
elif [ $EXIT_CODE -ne 0 ]; then
  echo "RE" > "$STATUS"
else
  echo "COMPLETED" > "$STATUS"
fi

exit 0
