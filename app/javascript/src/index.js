import $ from 'jquery';
import { indexTasks, postTask, deleteTask } from "./requests.js";

$(document).ready(function() {
  $("#add-button").on("click", function(event) {
    event.preventDefault();
    var content = $("#task-input").val(); 
    createTask(content);
    $("#task-input").val("");
  });

  function createTask(content) {
    postTask(content, function(response) {
      indexTasks(function(response) {
        var htmlString = response.tasks.map(function(task) {
          return createTaskHtml(task);
        });

        $("#tasks").html(htmlString);
        setupDeleteButtons();
      }, function(error) {
        console.error(error);
      });
    }, function(error) {
      console.error(error);
    });
  }

  function createTaskHtml(task) {
    return "<div class='row'><p class='col-xs-8'>" + 
      "<input type='checkbox' class='mark-complete mt-3' data-id='" + task.id + "'" + (task.completed ? "checked" : "") + ">" + task.content + 
      "<button class='delete btn btn-sm btn-danger' data-id='" + task.id + "'>Delete</button></div>";
  }

  function setupDeleteButtons() {
    $(".delete").on("click", function(event) {
      event.preventDefault();
      var taskId = $(this).data("id");
      deleteTask(taskId, function(response) {
        indexTasks(function(response) {
          var htmlString = response.tasks.map(function(task) {
            return createTaskHtml(task);
          });

          $("#tasks").html(htmlString);
          setupDeleteButtons();
        }, function(error) {
          console.error(error);
        });
      }, function(error) {
        console.error(error);
      });
    });
  }

  indexTasks(function(response) {
    var htmlString = response.tasks.map(function(task) {
      return createTaskHtml(task);
    });

    $("#tasks").html(htmlString);
    setupDeleteButtons();
  }, function(error) {
    console.error(error);
  });
});
