#!/usr/bin/env bash

set -x

black app --check
isort --check-only app
ruff check app
