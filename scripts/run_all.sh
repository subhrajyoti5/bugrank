#!/bin/bash
set -e

# Multi-language Runner Script for BugPulse
# Supports: C++, Python, Java
# Usage: ./run_all.sh {cpp|python|java} {jobId}

LANGUAGE="${1:-cpp}"
JOB_ID="${2}"

if [ -z "$JOB_ID" ]; then
    echo "Usage: $0 {cpp|python|java} {jobId}"
    exit 1
fi

# Configuration (shared across all languages)
JOB_DIR="/srv/bugpulse/jobs/$JOB_ID"
INPUT="$JOB_DIR/input.txt"
OUTPUT="$JOB_DIR/output.txt"
ERROR="$JOB_DIR/error.txt"
STATUS="$JOB_DIR/status.txt"
COMPILE_ERROR="$JOB_DIR/compile_error.txt"

# Shared resource limits
TIME_LIMIT=5          # seconds
MEM_LIMIT=262144      # KB = 256MB
COMPILE_TIMEOUT=10    # seconds (for languages that compile)

cd "$JOB_DIR" || exit 1

# Language-specific execution
case "$LANGUAGE" in
    cpp)
        run_cpp
        ;;
    python)
        run_python
        ;;
    java)
        run_java
        ;;
    *)
        echo "ERROR: Unknown language: $LANGUAGE"
        echo "SE" > "$STATUS"
        exit 1
        ;;
esac

# Helper function for C++
run_cpp() {
    SRC="$JOB_DIR/main.cpp"
    BIN="$JOB_DIR/a.out"

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

    set +e
    (
        ulimit -t "$TIME_LIMIT"
        ulimit -v "$MEM_LIMIT"
        timeout --kill-after=2s "$TIME_LIMIT"s \
            "$BIN" < "$INPUT" > "$OUTPUT" 2>> "$ERROR"
    )
    EXIT_CODE=$?
    set -e

    pkill -KILL -f "$BIN" 2>/dev/null || true

    if [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 137 ]; then
        echo "TLE" > "$STATUS"
    elif [ $EXIT_CODE -ne 0 ]; then
        echo "RE" > "$STATUS"
    else
        echo "COMPLETED" > "$STATUS"
    fi
}

# Helper function for Python
run_python() {
    SRC="$JOB_DIR/main.py"

    # Python doesn't need compilation, so we skip the compile phase
    echo "RUNNING" > "$STATUS"

    set +e
    (
        ulimit -t "$TIME_LIMIT"
        ulimit -v "$MEM_LIMIT"
        timeout --kill-after=2s "$TIME_LIMIT"s \
            python3 "$SRC" < "$INPUT" > "$OUTPUT" 2>> "$ERROR"
    )
    EXIT_CODE=$?
    set -e

    pkill -KILL -f "python3 $SRC" 2>/dev/null || true

    if [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 137 ]; then
        echo "TLE" > "$STATUS"
    elif [ $EXIT_CODE -ne 0 ]; then
        echo "RE" > "$STATUS"
    else
        echo "COMPLETED" > "$STATUS"
    fi
}

# Helper function for Java
run_java() {
    SRC="$JOB_DIR/Main.java"
    CLASS_DIR="$JOB_DIR"

    # Compilation Phase
    echo "COMPILING" > "$STATUS"
    ulimit -t "$COMPILE_TIMEOUT"
    ulimit -v "$MEM_LIMIT"

    if ! javac -d "$CLASS_DIR" "$SRC" 2> "$COMPILE_ERROR"; then
        echo "CE" > "$STATUS"
        cat "$COMPILE_ERROR" > "$ERROR"
        exit 10
    fi

    # Execution Phase
    echo "RUNNING" > "$STATUS"

    set +e
    (
        ulimit -t "$TIME_LIMIT"
        ulimit -v "$MEM_LIMIT"
        timeout --kill-after=2s "$TIME_LIMIT"s \
            java -cp "$CLASS_DIR" Main < "$INPUT" > "$OUTPUT" 2>> "$ERROR"
    )
    EXIT_CODE=$?
    set -e

    pkill -KILL -f "java -cp $CLASS_DIR Main" 2>/dev/null || true

    if [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 137 ]; then
        echo "TLE" > "$STATUS"
    elif [ $EXIT_CODE -ne 0 ]; then
        echo "RE" > "$STATUS"
    else
        echo "COMPLETED" > "$STATUS"
    fi
}

exit 0
