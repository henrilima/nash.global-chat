const firebaseConfig = {
    /* firebaseOptions */
};

firebase.initializeApp(firebaseConfig);

var Author = prompt("Qual o seu nome de usuário?");

if (!Author) Author = "Anônimo";

function enviarMensagem() {
    let Message = document.getElementById("message").value
        ? document.getElementById("message").value
        : false;

    if (Message === false) return alert("Insira uma mensagem válida!");

    firebase.database().ref("messages").push().set({
        sender: Author,
        message: Message,
    });
}

function eraseText() {
    document.getElementsByClassName("output")[0].value = "";
}

firebase
    .database()
    .ref("messages")
    .on("child_added", function (snapshot) {
        document.getElementById("allMessages").innerHTML +=
            `<li id="message${snapshot.key}"><span class="author"> ${
                snapshot.val().sender
            }` +
            (Author == snapshot.val().sender && Author !== "Anônimo"
                ? `<button id="button" data-id="${snapshot.key}" onclick="deletarMensagem(this)" style="cursor: pointer;">🗑️</button>`
                : "") +
            `</span><p>${snapshot.val().message}</p></li>`;
    });

function deletarMensagem(self) {
    var messageID = self.getAttribute("data-id");
    document
        .getElementById(`message${messageID}`)
        .getElementsByTagName("p")[0].value =
        '<i class="deleted">Esta mensagem foi deletada.</i>';

    firebase.database().ref("messages").child(messageID).set({
        sender: Author,
        message: '<i class="deleted">Esta mensagem foi deletada.</i>',
    });
}

firebase
    .database()
    .ref("messages")
    .on("child_changed", function (snapshot) {
        document.getElementById(
            `message${snapshot.key}`
        ).innerHTML = `<span class="author"> ${
            snapshot.val().sender
        }</span><p>${snapshot.val().message}</p>`;
    });
