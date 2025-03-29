import random
import os

# Game settings
DIFFICULTIES = {
    "easy": {"range": (1, 50), "max_attempts": 10},
    "medium": {"range": (1, 100), "max_attempts": 8},
    "hard": {"range": (1, 500), "max_attempts": 6}
}
HIGH_SCORE_FILE = "high_scores.txt"

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def load_high_scores():
    """Load high scores from file."""
    scores = []
    if os.path.exists(HIGH_SCORE_FILE):
        with open(HIGH_SCORE_FILE, "r") as file:
            for line in file:
                name, score = line.strip().split(",")
                scores.append((name, int(score)))
    return sorted(scores, key=lambda x: x[1], reverse=True)[:5]

def save_high_score(name, score):
    """Save a new high score."""
    scores = load_high_scores()
    scores.append((name, score))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[:5]
    with open(HIGH_SCORE_FILE, "w") as file:
        for name, score in scores:
            file.write(f"{name},{score}\n")

def display_high_scores():
    """Display the top 5 high scores."""
    clear_screen()
    print("=== High Scores ===")
    scores = load_high_scores()
    if not scores:
        print("No high scores yet!")
    else:
        for i, (name, score) in enumerate(scores, 1):
            print(f"{i}. {name}: {score} points")
    input("\nPress Enter to return to menu...")

def get_difficulty():
    """Get player's chosen difficulty level."""
    while True:
        clear_screen()
        print("=== Choose Difficulty ===")
        print("1. Easy (1-50, 10 attempts)")
        print("2. Medium (1-100, 8 attempts)")
        print("3. Hard (1-500, 6 attempts)")
        choice = input("Enter choice (1-3): ")
        if choice == "1":
            return "easy"
        elif choice == "2":
            return "medium"
        elif choice == "3":
            return "hard"
        else:
            print("Invalid choice! Try again.")

def calculate_score(attempts, max_attempts, difficulty):
    """Calculate score based on attempts and difficulty."""
    base_score = max_attempts - attempts + 1
    multiplier = {"easy": 10, "medium": 20, "hard": 50}
    return base_score * multiplier[difficulty]

def play_game():
    """Main game logic."""
    clear_screen()
    print("Welcome to the Number Guessing Game!")
    difficulty = get_difficulty()
    min_num, max_num = DIFFICULTIES[difficulty]["range"]
    max_attempts = DIFFICULTIES[difficulty]["max_attempts"]
    secret_number = random.randint(min_num, max_num)
    attempts = 0

    print(f"\nI'm thinking of a number between {min_num} and {max_num}.")
    print(f"You have {max_attempts} attempts.")

    while attempts < max_attempts:
        try:
            guess = int(input("Enter your guess: "))
            attempts += 1

            if guess < min_num or guess > max_num:
                print(f"Guess out of range! Must be between {min_num} and {max_num}.")
            elif guess == secret_number:
                score = calculate_score(attempts, max_attempts, difficulty)
                print(f"\nCongratulations! You guessed it in {attempts} attempts!")
                print(f"Your score: {score}")
                name = input("Enter your name for the high score: ")
                save_high_score(name, score)
                break
            else:
                distance = abs(secret_number - guess)
                if distance > 20:
                    hint = "Way off!"
                elif distance > 10:
                    hint = "Getting closer!"
                else:
                    hint = "Very close!"
                direction = "too low" if guess < secret_number else "too high"
                print(f"{hint} Your guess was {direction}. Attempts left: {max_attempts - attempts}")
        except ValueError:
            print("Please enter a valid number!")
    
    if attempts >= max_attempts:
        print(f"\nGame Over! The number was {secret_number}.")

    input("\nPress Enter to return to menu...")

def main_menu():
    """Display and handle the main menu."""
    while True:
        clear_screen()
        print("=== Number Guessing Game ===")
        print("1. Start Game")
        print("2. View High Scores")
        print("3. Exit")
        choice = input("Enter choice (1-3): ")

        if choice == "1":
            play_game()
        elif choice == "2":
            display_high_scores()
        elif choice == "3":
            print("Thanks for playing!")
            break
        else:
            print("Invalid choice! Try again.")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main_menu()
