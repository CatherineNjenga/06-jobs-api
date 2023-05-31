'use strict';

async function buildBlogsTable(blogsTable, blogsTableHeader, token, message) {
  try {
    const response = await fetch("/api/v1/blogs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [blogsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        blogsTable.replaceChildren(...children); // clear this for safety
        return 0;
      } else {
        for (let i = 0; i < data.blogs.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.blogs[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.blogs[i]._id}>delete</button></td>`;
          let rowHTML = `<td>${data.blogs[i].title}</td><td>${data.blogs[i].date}</td><td>${data.blogs[i].writtenBy}</td><td>${data.blogs[i].blogPost}</td><td>${data.blogs[i].category}</td><td>${data.blogs[i].comments}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        blogsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const logonRegister = document.getElementById("logon-register");
  const logon = document.getElementById("logon");
  const register = document.getElementById("register");
  const logonDiv = document.getElementById("logon-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const registerDiv = document.getElementById("register-div");
  const name = document.getElementById("name");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  const blogs = document.getElementById("blogs");
  const blogsTable = document.getElementById("blogs-table");
  const blogsTableHeader = document.getElementById("blogs-table-header");
  const addBlog = document.getElementById("add-blog");
  const editBlog = document.getElementById("edit-blog");
  const title = document.getElementById("title");
  const date = document.getElementById("date");
  const writtenBy = document.getElementById("written-by");
  const blogPost = document.getElementById("blog-post");
  const category = document.getElementById("category");
  const comments = document.getElementById("comments");
  const addingBlog = document.getElementById("adding-blog");
  const blogsMessage = document.getElementById("blogs-message");
  const editCancel = document.getElementById("edit-cancel");

  // section 2 
  let showing = logonRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = logonRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildBlogsTable(
        blogsTable,
        blogsTableHeader,
        token,
        message
      );
      if (count > 0) {
        blogsMessage.textContent = "";
        blogsTable.style.display = "block";
      } else {
        blogsMessage.textContent = "There are no blog post to display for this user.";
        blogsTable.style.display = "none";
      }
      blogs.style.display = "block";
      showing = blogs;
    } else {
      logonRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      blogsTable.replaceChildren(blogsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    } // section 4
    else if (e.target === addBlog) {
      showing.style.display = "none";
      editBlog.style.display = "block";
      showing = editBlog;
      delete editBlog.dataset.id;
      title.value = "";
      date.value = "";
      writtenBy.value = "";
      blogPost.value = "";
      category.value = "career";
      comments.value = "";
      addingBlog.textContent = "add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      title.value = "";
      date.value = "";
      writtenBy.value = "";
      blogPost.value = "";
      category.value = "career";
      comments.value = "";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingBlog) {

      if (!editBlog.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/blogs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              date: date.value,
              writtenBy: writtenBy.value,
              blogPost: blogPost.value,
              category: category.value,
              comments: comments.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = "The blog post entry was created.";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            title.value = "";
            date.value = "";
            writtenBy.value = "";
            blogPost.value = "";
            category.value = "career";
            comments.value = "";
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const blogID = editBlog.dataset.id;
          const response = await fetch(`/api/v1/blogs/${blogID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              date: date.value,
              writtenBy: writtenBy.value,
              blogPost: blogPost.value,
              category: category.value,
              comments: comments.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "The entry was updated.";
            showing.style.display = "none";
            title.value = "";
            date.value = "";
            writtenBy.value = "";
            blogPost.value = "";
            category.value = "career";
            comments.value = "";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {

          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5
    else if (e.target.classList.contains("editButton")) {
      editBlog.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/blogs/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          title.value = data.blog.title;
          date.value = data.blog.date;
          writtenBy.value = data.blog.writtenBy;
          blogPost.value = data.blog.blogPost;
          category.value = data.blog.category;
          comments.value = data.blog.comments;
          showing.style.display = "none";
          showing = editBlog;
          showing.style.display = "block";
          addingBlog.textContent = "update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The blog post entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    } // section 6
    else if (e.target.classList.contains("deleteButton")) {
      editBlog.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/blogs/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          // title.value = data.blog.title;
          // date.value = data.blog.date;
          // writtenBy.value = data.blog.writtenBy;
          // blogPost.value = data.blog.blogPost;
          // category.value = data.blog.category;
          // comments.value = data.blog.comments;
          // showing.style.display = "none";
          // showing = editBlog;
          // showing.style.display = "block";
          // addingBlog.textContent = "update";
          message.textContent = "The blog post has been deleted";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);

        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The blog post entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
  })
});