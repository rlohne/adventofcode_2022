# Read input as list
input <- readLines("day_04/input.txt") %>% 
  strsplit(split = "[-,]") %>% 
  map(as.integer)


# Part 1
pairs <- 0

for(i in seq_along(1:length(input))){
  first_elf <- seq(input[[i]][1], input[[i]][2])
  second_elf <- seq(input[[i]][3], input[[i]][4])
  
  if(length(first_elf) == sum(first_elf %in% second_elf) ||
     length(second_elf) == sum(second_elf %in% first_elf)) {
    pairs <- pairs + 1
  } 

}


# Part 2
pairs <- 0

for(i in seq_along(1:length(input))){
  first_elf <- seq(input[[i]][1], input[[i]][2])
  second_elf <- seq(input[[i]][3], input[[i]][4])
  
  if(sum(first_elf %in% second_elf) > 0 ||
     sum(second_elf %in% first_elf) > 0) {
    pairs <- pairs + 1
  } 
  
}
