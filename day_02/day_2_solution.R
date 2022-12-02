
library(tidyverse)
# Read the input 
rps <- read.delim(file = "day_02/day02_input.txt", header = FALSE)


rps_tbl <- rps %>% 
  # Extract the string 
  mutate(results = str_split(rps$V1, " ", 3))  
  # Extract player 1 results

rps_scores_tbl <- rps_tbl %>% 

mutate(player1 = sapply(rps_tbl$results,"[[",1)) %>% 
  # Extract player 2 results
  mutate(player2 = sapply(rps_tbl$results,"[[",2)) %>% 
  # Assign player 1 score
  mutate(match_res = case_when(
    player1 == "A" & player2 == "Y" ~ "Player 2",
    player1 == "A" & player2 == "X" ~ "Draw",
    player1 == "A" & player2 == "Z" ~ "Player 1",
    player1 == "B" & player2 == "Y" ~ "Draw",
    player1 == "B" & player2 == "X" ~ "Player 1",
    player1 == "B" & player2 == "Z" ~ "Player 2",
    player1 == "C" & player2 == "Y" ~ "Player 1",
    player1 == "C" & player2 == "X" ~ "Player 2",
    player1 == "C" & player2 == "Z" ~ "Draw"
    )) %>% 
  mutate(player2_score = case_when(
    player2 == "X" & match_res == "Player 2" ~ 7,
    player2 == "Y" & match_res == "Player 2" ~ 8,
    player2 == "Z" & match_res == "Player 2" ~ 9,
    player2 == "X" & match_res == "Player 1" ~ 1,
    player2 == "Y" & match_res == "Player 1" ~ 2,
    player2 == "Z" & match_res == "Player 1" ~ 3,
    player2 == "X" & match_res == "Draw" ~ 4,
    player2 == "Y" & match_res == "Draw" ~ 5,
    player2 == "Z" & match_res == "Draw" ~ 6,
  )) %>% 
  select(player2_score)

## Part 1
# Sum scores
sum(rps_scores_tbl$player2_score)


## Part 2
rps_scores_part2_tbl <- rps_tbl %>% 
  # Extract player 1 shape
  mutate(player1 = sapply(rps_tbl$results,"[[",1)) %>% 
  # Extract needed result
  mutate(outcome = sapply(rps_tbl$results,"[[",2)) %>% 
  # Calculate needed response 
  mutate(player2_response = case_when(
    player1 == "A" & outcome == "X" ~ "C",
    player1 == "A" & outcome == "Y" ~ "A",
    player1 == "A" & outcome == "Z" ~ "B",
    player1 == "B" & outcome == "X" ~ "A",
    player1 == "B" & outcome == "Y" ~ "B",
    player1 == "B" & outcome == "Z" ~ "C",
    player1 == "C" & outcome == "X" ~ "B",
    player1 == "C" & outcome == "Y" ~ "C",
    player1 == "C" & outcome == "Z" ~ "A",
   )) %>% 
  mutate(player2_score = case_when(
    player2_response == "A" & outcome == "Z" ~ 7,
    player2_response == "B" & outcome == "Z" ~ 8,
    player2_response == "C" & outcome == "Z" ~ 9,
    player2_response == "A" & outcome == "X" ~ 1,
    player2_response == "B" & outcome == "X" ~ 2,
    player2_response == "C" & outcome == "X" ~ 3,
    player2_response == "A" & outcome == "Y" ~ 4,
    player2_response == "B" & outcome == "Y" ~ 5,
    player2_response == "C" & outcome == "Y" ~ 6,
  ))

sum(rps_scores_part2_tbl$player2_score)
  