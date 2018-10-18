const app = require("../app");
const request = require("supertest");

describe("routes/movies", () => {

  it("POST /movies should return a new movie object", () => {
    requestBody = { name: "test movie", artist: "rhianna"};
    responseBody = {id: 1, name: "test movie", artist: "rhianna"};
    
    return request(app)
    .post("/movies")
    .send(requestBody)
    
    .then(response => {
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(responseBody);
    });
  });
  
  it("GET /movies should return an array with one element", () => {
    return request(app)
    .get("/movies")
    
    .then(response => {
      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length).toEqual(1);
    });
  });

  it("GET /movies/:id should return the movie with id", () => {
    expected = { name: "test movie", artist: "rhianna"};
    
    return request(app)
    .get("/movies/1")
    .send(requestBody)
    
    .then(response => {
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(expected);
    });
  });
  
  it("PUT /movies should return the updated movie", () => {
    requestBody = { name: "updated movie", artist: "rhianna" };
    responseBody = { id: 1, name: "updated movie", artist: "rhianna" };
    
    return request(app)
    .put("/movies/1")
    .send(requestBody)
    
    .then(response => {
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(responseBody);
    });
  });

  it("DELETE /movies/:id should return the deleted movie", () => {
    responseBody = { id: 1, name: "updated movie", artist: "rhianna" };

    return request(app)
    .delete("/movies/1")

    .then(response => {
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(responseBody);
    })
  });
  
  it("GET /movies should return an empty array", () => {
    return request(app)
    .get("/movies")
    
    .then(response => {
      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toEqual(0);
    });
  });

});
