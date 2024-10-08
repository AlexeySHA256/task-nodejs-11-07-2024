import db from "../db.js";

export class EventRepository {
  async createEvent(eventData) {
    return db
      .query(
        "INSERT INTO events(name, date, description) VALUES ($1, $2, $3) RETURNING *",
        [eventData.name, eventData.date, eventData.description]
      )
      .then((result) => result.rows[0])
      .catch((err) => {
        switch (err.code) {
          case "23505":
            throw new UniqueViolationError(
              "Event with this name already exists"
            );
          default:
            throw err;
        }
      });
  }

  async getEventsByDate(date) {
    return db
      .query("SELECT * FROM events WHERE date = $1", [date])
      .then((result) => result.rows);
  }

  async listEvents(date) {
    let query = "SELECT * FROM events";
    const queryArgs = [];
    if (date) {
      query += " WHERE date = $1";
      queryArgs.push(date);
    }
    return db.query(query, queryArgs).then((result) => result.rows);
  }

  async getEventByID(eventId) {
    return db
      .query("SELECT * FROM events WHERE id = $1", [eventId])
      .then((result) => {
        if (result.rows.length === 0) {
          throw new NotFoundError(`Event with id ${eventId} not found`);
        }
        return result.rows[0];
      });
  }

  async deleteEvent(eventId) {
    await db.query("DELETE FROM events WHERE id = $1", [eventId]);
  }

  async updateEvent(eventData) {
    return db
      .query(
        "UPDATE events SET name = $1, date = $2, description = $3 WHERE id = $4 RETURNING *",
        [eventData.name, eventData.date, eventData.description, eventData.id]
      )
      .then((result) => result.rows[0])
      .catch((err) => {
        switch (err.code) {
          case "23505":
            throw new UniqueViolationError(
              "Event with this name already exists"
            );
          default:
            throw err;
        }
      });
  }

  async deleteEvent(eventId) {
    return db.query("DELETE FROM events WHERE id = $1 RETURNING id", [eventId])
    .then((result) => {
      if (!result.rows.length) {
        throw new NotFoundError(`Event with id ${eventId} not found`);
      }
    })
  }
}
