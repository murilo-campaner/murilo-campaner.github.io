(function () {
  const form = document.querySelector(".email-form");
  // Before trying to hjack this api key, know that it's an free key =)
  // You can get one here: https://rapidapi.com/sendgrid/api/sendgrid/
  const FREE_API_KEY = "a1a07aa797mshdd17b141ff406b6p11c4a5jsna639c0994f82";

  const successAlert = () =>
    swal({
      text: "Thank you for your interest!",
      content: `
    <div>
      <p>
        Your message was successfully delivered and I will answer as soon as possible (I usually take a maximum of 2 days).
      </p>
      <p>
        If it is an urgent matter, feel free to send me a message on <a href="https://www.linkedin.com/in/murilo-campaner" target="_blank" rel="noopener">Linkedin</a>.
      </p>
    </div>
    `,
      icon: "success",
    });

  const errorAlert = () =>
    swal({
      text: "Something wrong happened!",
      content: `
    <div>
      <p>
        Your message could not be delivered. Sorry about that, I'm already notified about this problem and I will take a look on it soon!
      </p>
      <p>
        Please, feel free to send me a message on <a href="https://www.linkedin.com/in/murilo-campaner" target="_blank" rel="noopener">Linkedin</a> while this problem is not fixed.
      </p>
    </div>
    `,
      icon: "error",
    });

  const cleanForm = () => {
    const inputs = document.querySelectorAll(".email-form input");
    inputs.forEach((input) => (input.value = ""));
  };

  const getTodayLoggedRequests = () => {
    const requests = JSON.parse(sessionStorage.getItem("email-requests"));
    const filteredRequests = requests.filter((request) => {
      const yesterdayFromNow = new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).getTime();
      return request.time > yesterdayFromNow;
    });

    return filteredRequests;
  };

  const logRequest = (payload) => {
    const previousRequests = getLoggedRequests();
    sessionStorage.setItem(
      "email-requests",
      JSON.stringify([
        ...previousRequests,
        {
          time: new Date().getTime(),
          payload,
        },
      ])
    );
  };

  $("form").on("click", ".submit", function (event) {
    event.stopPropagation();
    event.preventDefault();

    const senderName = document.querySelector(".email-form #name").value;
    const senderEmail = document.querySelector(".email-form #email").value;
    const senderMessage = document.querySelector(".email-form #message").value;

    const settings = {
      async: true,
      crossDomain: true,
      url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "rapidprod-sendgrid-v1.p.rapidapi.com",
        "x-rapidapi-key": "a1a07aa797mshdd17b141ff406b6p11c4a5jsna639c0994f82",
      },
      processData: false,
      data: {
        personalizations: [
          {
            to: [{ email: "contato@campaner.dev" }],
            subject: `Murilo Porfólio - Contact from ${senderName}`,
          },
        ],
        from: {
          email: senderEmail,
        },
        content: [
          {
            type: "text/plain",
            value: `${senderMessage}`,
          },
        ],
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });

    fetch("https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "rapidprod-sendgrid-v1.p.rapidapi.com",
        "x-rapidapi-key": FREE_API_KEY,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "contato@campaner.dev" }],
            subject: `Murilo Porfólio - Contact from ${senderName}`,
          },
        ],
        from: {
          email: senderEmail,
        },
        content: [
          {
            type: "text/plain",
            value: `${senderMessage}`,
          },
        ],
      }),
    })
      .then((response) => {
        if (getTodayLoggedRequests().length > 2) {
          throw new Error("Invalid request");
        }
        logRequest({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
        });
        successAlert();
        cleanForm();
      })
      .catch((err) => {
        errorAlert();
      });
  });
})();
