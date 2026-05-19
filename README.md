# 🎮 Alias Game

A dynamic, full-featured Single Page Application (SPA) of the classic "Alias" word-guessing game

---

## 📖 Game Rules / Правила гри

Choose your language to read the rules:

<details>
<summary><b>🇺🇸 English Version</b></summary>

### 🎮 General Rules
**Alias** is an exciting word-guessing team game. The main goal is to explain as many words as possible to your teammates within a limited time, without using the hidden word itself.

### How to Play:
1. **Divide into teams:** The game requires at least two teams of two or more players.
2. **Set up the game:** Choose your word categories, the winning score (target number of words), and the turn timer.
3. **Start the turn:** One player becomes the **Explainer**, and the others become the **Guessers**.
4. **Explain and Guess:** * The Explainer starts the timer and begins explaining the words appearing on the screen.
   * If the team guesses correctly, they get **+1 point**.
   * If the team skips a word, they lose **-1 point**.
5. **Switch roles:** Once the timer runs out, the turn passes to the next team. The first team to reach the target score wins the game!

### 🚫 Explaining Restrictions:
* You **cannot** use the word itself, its derivatives, or parts of it (e.g., if the word is "Football", you cannot say "Foot" or "Ball").
* You **cannot** translate the word into other languages.
* You **can** use synonyms, antonyms, descriptions, and associations!

</details>

<details>
<summary><b>🇺🇦 Українська версія</b></summary>

### 🎮 Загальні правила
**Еліас (Alias)** — це азартна та динамічна командна гра в слова. Головна мета — пояснити якнайбільше слів своїм партнерам по команді за обмежений час, не називаючи самого загаданого слова.

### Перебіг гри:
1. **Поділ на команди:** Для гри потрібно щонайменше дві команди (від 2 гравців у кожній).
2. **Налаштування:** Виберіть категорії слів, кількість балів для перемоги та час на один раунд.
3. **Початок раунду:** One гравець стає **Пояснювачем**, а інші члени його команди — **Відгадувачами**.
4. **Пояснення та відгадування:**
   * Пояснювач запускає таймер і починає описувати слова, що з'являються на екрані.
   * За кожне вгадане слово команда отримує **+1 бал**.
   * Якщо слово занадто складне, його можна пропустити (це знімає **-1 бал**).
5. **Зміна ходу:** Після закінчення часу хід переходить до наступної команди. Перемагає та команда, яка першою набере цільову кількість балів!

### 🚫 Правила пояснення (Що заборонено):
* Використовувати однокореневі слова та спільнокореневі назви (наприклад, не можна казати «літати», якщо загадане слово «літак»).
* Перекладати слова на інші мови.
* **Що можна:** використовувати синоніми, антоніми, описи, натяки та асоціації!

</details>

---

## How to Run

Follow these steps to clone, configure, and run the project locally on your machine.

### 1. Clone the Repository

First, clone this repository and navigate into the project directory:

~~~bash
git clone https://github.com/k0dekk/alias-game.git
cd alias-game
~~~

### 2. Install Dependencies
The project uses npm and Vite as a build tool. Install all required dependencies (including the Firebase SDK) by running:

~~~bash
npm install
~~~
### 3. Configure Firebase (Environment Variables)
To secure your Firebase configuration keys for authentication, statistics storage, and image uploads, create a .env file in the root directory of the project:

~~~Bash
touch .env
~~~
Open the .env file and add your Firebase project configuration credentials. Since this is a Vite-powered project, all custom environment variables must be prefixed with VITE_:  

~~~bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
~~~

## or

[Github Pages](https://k0dekk.github.io/alias-game/)


---

## 🚀 Key Features & Engineering Insights

This project served as a massive learning milestone. While building this SPA, I dove deep into advanced architectural patterns and modern frontend/backend techniques. Here is a glimpse of what was mastered and implemented:

* **Internationalization (i18n):** Full multi-language architecture supporting English and Ukrainian with seamless real-time switching and state persistence.
* **Advanced Data Structures:** Learned to properly configure, optimize, and manipulate **Queues** to manage game words efficiently and eliminate repetition.
* **Firebase Integration:** Implemented robust cloud backend solutions including user **Authentication** and real-time state synchronization.
* **Modern Frontend Mechanics:** Mastered and integrated complex UI techniques such as `Snap Scroll` and advanced browser `Observers` (e.g., Intersection Observer API) for flawless user interactions.
* this is just the tip of the iceberg of the entire list of skills acquired during development

---


## Labs

you can find the direct links to the laboratory assignments implemented within this repository below:

* [Task1: Generators and Iterators] - [here](https://github.com/k0dekk/alias-game/tree/main/utils/generator)
* [Task 2: Project Setup] - *if you are reading this then it is done*
* [Task 3: Implementing a Memoization Function] - [here](https://github.com/k0dekk/LabsOP/tree/main/2sem/lab3)
* [Task 4: Implementing a Bi-Directional Priority Queue] - [here](https://github.com/k0dekk/alias-game/tree/main/utils/queue)
* [Task 5: Async Array Function Variants] - [here](https://github.com/k0dekk/alias-game/tree/main/utils/asyncSome)
* [Task 6: Large Data Processing with Streams or Async Iterators] - [here](https://github.com/k0dekk/alias-game/tree/main/utils/stream)
* [Task 7: Reactive Communication with Observables or EventEmitters] - [here](https://github.com/k0dekk/alias-game/blob/main/ui/observer)
* [Task 8: Implementing an Authentication Proxy for an API Service] - [here](https://github.com/k0dekk/alias-game/tree/main/utils/proxy)
* [Task 9: Implementing a Logging Decorator with Configurable Log Levels] - [here](https://github.com/k0dekk/alias-game/tree/main/utils/logger)