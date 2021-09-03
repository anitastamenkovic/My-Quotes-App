// DOM
const quotesList = document.getElementById("quotes-list");
const form = document.getElementById("add-quote-form");

// create element i render cafe
function renderQuote(doc) {
  let li = document.createElement("li");
  let quote = document.createElement("input");
  let author = document.createElement("input");
  let cross = document.createElement("div");
  let edit = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  quote.type = "text";
  quote.value = doc.data().quote;
  author.type = "text";
  author.value = doc.data().author;
  cross.classList.add("cross");
  cross.textContent = "x";
  edit.classList.add("edit");
  edit.innerHTML = "&#9998;";

  li.appendChild(quote);
  li.appendChild(author);
  li.appendChild(cross);
  li.appendChild(edit);

  quotesList.appendChild(li);

  // deleting data
  cross.addEventListener("click", (event) => {
    event.stopPropagation();
    let id = event.target.parentElement.getAttribute("data-id");
    db.collection("quotes").doc(id).delete();
  });

  // editing data
  edit.addEventListener("click", (event) => {
    event.stopPropagation();
    let id = event.target.parentElement.getAttribute("data-id");
    if (form.quote.value != "" && form.author.value != "") {
      db.collection("quotes").doc(id).update({
        quote: quote.value,
        author: author.value,
      });
    }
  });
}

// getting data
// db.collection("quotes")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderQuote(doc);
//     });
//   });

// getting particular data
// db.collection("quotes")
//   .where("author", "==", "Albert Einstein")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderQuote(doc);
//     });
//   });

// getting data by order
// db.collection("quotes")
//   .where("author", "==", "Albert Einstein")
//   .orderBy("quote")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderQuote(doc);
//     });
//   });

//   saving data
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.quote.value != "" && form.author.value != "") {
    db.collection("quotes").add({
      quote: form.quote.value,
      author: form.author.value,
    });
  }

  form.quote.value = "";
  form.author.value = "";
});

// real-time listener
db.collection("quotes")
  .orderBy("author")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderQuote(change.doc);
      } else if (change.type == "removed") {
        let li = quotesList.querySelector("[data-id=" + change.doc.id + "]");
        quotesList.removeChild(li);
      }
    });
  });
