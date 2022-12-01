# Read the input file
calories <- scan(file = "day_01/input.txt", blank.lines.skip = FALSE)

# Create a df with the sum of each elf's calories
calories_df <- as_tibble(calories) %>%
  mutate(value = na_if(value, NA)) %>% 
  group_by(Group = cumsum(is.na(value)) +1) %>% 
  na.omit() %>% 
  group_by(Group) %>% 
  summarise(
    calories = sum(value)
  )

# Answer the questions

## Question 1: 

max(calories_df$calories)

## Question 2: 
sum(head(sort(calories_df$calories, decreasing = TRUE),3))
