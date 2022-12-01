# Read the input file
calories <- scan(file = "day_01/input.txt", blank.lines.skip = FALSE)

# Create a list of the values
calories_list <- as_tibble(calories) %>%
  mutate(value = na_if(value, NA)) %>% 
  group_by(id_Group =cumsum(is.na(value))+1) %>% 
  na.omit() %>% 
  summarise(value1 =list(value)) %>% 
  pull(value1)

# Create a data.frame from the list
dt = rbindlist(
  lapply(calories_list, function(x) data.table(t(x))),
  fill = TRUE)

# Sum the list elements for each elf
df <- dt %>% as_tibble() %>% 
  mutate(sum = rowSums(across(where(is.numeric)), na.rm = TRUE)) %>% 
  select(sum)

# Find the maximum amount of calolires one elf is carrying
max(df$sum)

# Find and sum the top three elves calorie sums 
sum(head(sort(df$sum, decreasing = TRUE),3))