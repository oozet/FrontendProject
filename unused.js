
function renderAllUsers() {
  try {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = ""; // Clear any existing content
    const articleElemenet = document.createElement("article");
    const formElement = document.createElement("form");

    const selectElement = document.createElement("select");
    data.users.forEach((user) => {
      const optionElement = document.createElement("option");
      optionElement.value = user.id;
      optionElement.textContent = user.username;
      selectElement.appendChild(optionElement);
    });
    formElement.appendChild(selectElement);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    formElement.appendChild(submitButton);

    articleElemenet.appendChild(formElement);
    mainContent.appendChild(articleElemenet);
  } catch (error) {
    console.error("Error while rendering user form: " + error + " Rethrowing to caller.");
    throw error;
  }
}