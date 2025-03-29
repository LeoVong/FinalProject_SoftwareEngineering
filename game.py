import random

def number_guessing_game():
    # Generate a random number between 1 and 100
    secret_number = random.randint(1, 100)
    attempts = 0

    print("Welcome to the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")

    while True:
        try:
            # Get player's guess
            guess = int(input("Enter your guess: "))
            attempts += 1

            # Check the guess
            if guess == secret_number:
                print(f"Congratulations! You guessed the number in {attempts} attempts!")
                break
            elif guess < secret_number:
                print("Too low! Try again.")
            else:
                print("Too high! Try again.")
        except ValueError:
            print("Please enter a valid number.")

if __name__ == "__main__":
    number_guessing_game()

def test_dummy():
    pass
