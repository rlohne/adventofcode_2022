library(tidyverse)
library(zoo)

input <- readLines("day_06/input.txt")

input <- unlist(str_split(input, "", nchar(input)))

signal_length <- 14
offset <- signal_length - 1

for (i in seq_len(length(input) - offset)) {
  if (length(unique(input[seq(i, i + offset)])) == signal_length) {
    break
  }
}
i + offset
