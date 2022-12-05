library(tidyverse)

# Read input and see where instructions begin
input <- readLines("day_05/input.txt")

# Extract drawing of stacks

stacks <- list(c("P", "F", "M", "Q", "W", "G", "R", "T"),
               c("H", "F", "R"),
               c("P", "Z", "R", "V", "G", "H", "S", "D"),
               c("Q", "H", "P", "B", "F", "W", "G"),
               c("P", "S", "M", "J", "H"),
               c("M", "Z", "T", "H", "S", "R", "P", "L"),
               c("P", "T", "H", "N", "M", "L"),
               c("F", "D", "Q", "R"),
               c("D","S", "C", "N", "L", "P", "H"))


# Extract instructions on how to move
instructions <- input[(11):length(input)] %>% 
  str_extract_all("[0-9]+") %>% 
  map(as.integer)


for(i in instructions) {
  amount <- i[1]
  from <- i[2]
  to <- i[3]
  
  stacks[[to]] <- c(stacks[[to]], rev(tail(stacks[[from]], amount)))
  stacks[[from]] <- head(stacks[[from]], -amount)
  
}

# Part 1
print(map_chr(stacks, tail, 1))

s

# Part 2

tacks <- list(c("P", "F", "M", "Q", "W", "G", "R", "T"),
              c("H", "F", "R"),
              c("P", "Z", "R", "V", "G", "H", "S", "D"),
              c("Q", "H", "P", "B", "F", "W", "G"),
              c("P", "S", "M", "J", "H"),
              c("M", "Z", "T", "H", "S", "R", "P", "L"),
              c("P", "T", "H", "N", "M", "L"),
              c("F", "D", "Q", "R"),
              c("D","S", "C", "N", "L", "P", "H"))

for(i in instructions) {
  amount <- i[1]
  from <- i[2]
  to <- i[3]
  
  stacks[[to]] <- c(stacks[[to]], tail(stacks[[from]], amount))
  stacks[[from]] <- head(stacks[[from]], -amount)
  
}
print(map_chr(stacks, tail, 1))





