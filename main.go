package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

func main() {
	app := fiber.New()

	todos := []Todo{}
	nextID := 1 // Keep track of the highest ID to prevent collisions

	// Serve the static HTML/CSS/JS files from the 'public' directory
	app.Static("/", "./public")

	// API: Get all todos
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(todos)
	})

	// API: Create a new todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Todo body is required"})
		}

		todo.ID = nextID
		nextID++
		todos = append(todos, *todo)

		return c.Status(201).JSON(todo)
	})

	// API: Toggle completed status of a todo
	app.Patch("/api/todos/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				todos[i].Completed = !todos[i].Completed
				return c.Status(200).JSON(todos[i])
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	})

	// API: Delete a todo
	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				// Remove the item from the slice
				todos = append(todos[:i], todos[i+1:]...)
				return c.Status(200).JSON(fiber.Map{"msg": "Todo deleted"})
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	fmt.Println("Server is running on port", port)
	log.Fatal(app.Listen(":" + port))
}
