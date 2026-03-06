# 📋 My Agenda - Go Todo List

A spectacular, modern, and minimalist Todo List application built with **Go (Fiber)** and a stunning **Glassmorphism** frontend.

![Screenshot](https://via.placeholder.com/800x400?text=My+Agenda+Preview)

## ✨ Features

- **Sleek UI/UX:** Stunning mesh gradient backgrounds and glassmorphism cards.
- **Dynamic Animations:** Smooth entry and exit animations for tasks.
- **Filtering:** Easily switch between All, Active, and Completed tasks.
- **Optimistic UI:** Instant feedback when toggling or deleting tasks.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Fast Backend:** Powered by Go and the Fiber web framework.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+).
- **Backend:** [Go](https://go.dev/) with [Fiber](https://gofiber.io/) Framework.
- **Icons:** Font Awesome 6.
- **Typography:** [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts.

## 🚀 Getting Started

### Prerequisites

- [Go](https://go.dev/doc/install) (version 1.21 or later recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MEASWs/todo-list-go.git
   cd todo-list-go
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Run the application:
   ```bash
   go run main.go
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4000
   ```

## ☁️ Deployment

This project is configured for easy deployment on **Render** or **Railway**.

### Deploying to Render

1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Environment:** `Go`
   - **Build Command:** `go build -o app main.go`
   - **Start Command:** `./app`
4. Click **Create Web Service**.

## 📝 License

This project is open-source and available under the MIT License.

---

Built with ❤️ by [MEASWs](https://github.com/MEASWs)
