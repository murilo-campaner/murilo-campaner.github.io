(function () {
  // Before trying to hjack this api key, know that it's an free key =)
  // You can get one here: https://rapidapi.com/sendgrid/api/sendgrid/
  const FREE_API_KEY = "a1a07aa797mshdd17b141ff406b6p11c4a5jsna639c0994f82";

  const successAlert = (message) => {
    const content = document.createElement("div");
    content.className = 'swal-content-text'
    content.innerHTML = message;
    
    swal({
      text: "Thank you for your interest!",
      content: content,
      icon: "success",
    });
  }

  const errorAlert = (message) => {
    const content = document.createElement("div")
    content.className = 'swal-content-text'
    content.innerHTML = message

    swal({
      text: "Your message could not be delivered",
      content: content,
      icon: "error",
    });
  }

  const getTodayLoggedRequests = () => {
    try {
      const requests =
        JSON.parse(sessionStorage.getItem("email-requests")) || [];

      const filteredRequests = requests.filter((request) => {
        const yesterdayFromNow = new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).getTime();
        return request.time > yesterdayFromNow;
      });

      return filteredRequests;
    } catch (error) {
      return [];
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const logRequest = (payload) => {
    const previousRequests = getTodayLoggedRequests();
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

  const form = document.querySelector("#email-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (getTodayLoggedRequests().length > 2) {
      errorAlert(`
        <p>Please, feel free to send me a message on my <a style="color: #0a66c2;" href="https://www.linkedin.com/in/murilo-campaner" target="_blank" rel="noopener">Linkedin</a> while this problem is not fixed.</p>
      `);
      return;
    }

    const data = new FormData(event.target);
    console.log(data.get('name'));

    if (!data.get('name')) {
      errorAlert(`<p style="text-align: center;">Please, inform your name.</p>`);
      return;
    } else if (!validateEmail(data.get('email'))) {
      errorAlert(`<p style="text-align: center;">Please, inform a valid e-mail address.</p>`);
      return;
    } else if (!data.get('message')) {
      errorAlert(`<p style="text-align: center;">Please, write a message.</p>`);
      return;
    }


    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    }).then((response) => response.json())
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Invalid submission");
        }

        successAlert(`
          <p>Your message was successfully delivered and I will answer as soon as possible (I usually take a maximum of 2 days).</p>
          <p>If it is an urgent matter, feel free to send me a message on <a style="color: #0a66c2;" href="https://www.linkedin.com/in/murilo-campaner" target="_blank" rel="noopener">Linkedin</a>.</p>
        `);

        logRequest({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
        });

        form.reset();
      })
      .catch(function (error) {
        console.log(error.message);
        errorAlert(`
          <p>Sorry, I'm already notified about this problem and I will fix it soon!</p>
          <p>Please, feel free to send me a message on my <a style="color: #0a66c2;" href="https://www.linkedin.com/in/murilo-campaner" target="_blank" rel="noopener">Linkedin</a> while this problem is not fixed.</p>
        `);
      });
  });
})();
