(function () {
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

  const getTodayLoggedRequests = () => {
    try {
      const requests = JSON.parse(sessionStorage.getItem("email-requests")) || [];
      
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
    const form = $(this);
    event.preventDefault();

    if (getTodayLoggedRequests().length > 2) {
      errorAlert();
      return;
    }
    
    const data = new FormData(event.target);

    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Invalid submission');
      }
      successAlert();
      logRequest({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      });

      form.reset();
    })
    .catch(function(xhr, status, error) {
      errorAlert();
    });
  });
})();
