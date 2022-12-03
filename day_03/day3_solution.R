library(tidyverse)
# Read input and create a list
input <- readLines("day_03/input.txt") %>% 
  strsplit(split = "")

# Part 1

# Function to split strings in half and find common letters
backpack_split <- function(x){
  split <- length(x) / 2
  intersect(
    head(x, split),
    tail(x, split)
  )
}

# List lowercase and uppercase letters
priorities <- c(letters, LETTERS)

# Map the list and find common letters, then match to position in alphabet and sum scores
map_chr(input, backpack_split) %>% 
  match(priorities) %>% 
  sum()


# Part 2

# Split input list into groups of three elves
groups <- split(input, 
                rep(seq_len(length(input) / 3), 
                    each = 3))


# Function to find common letters between the three elves per group
common_groups <- function(x){
  first <- x[[1]]  
  two <- intersect(first, x[[2]])
  intersect(two, x[[3]])
}

# Map the list and find common letters, then match to position in alphabet and sum scores
map_chr(groups, common_groups) %>% 
  match(priorities) %>% 
  sum()


