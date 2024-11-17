$(document).ready(function () {
  $("form#invitation input, form#invitation select").on("change", function (e) {
  });

  $("form#invitation input, form#invitation select").on("input", function (e) {
    const id = `#${$(this).attr("name")}_error`.replace(/\[/g, '').replace(/]/g, '_');
    $(`form#invitation ${id}`).text("");

  });

  $("form#invitation input[name=attending]").on('input', function (e) {
    $("form#invitation #plus-one-input").toggleClass('d-none');
    
    if($(this).prop("checked") == false) {
      $("form#invitation input[name=come_with_plus_one]").prop('checked', false);    
      $("form#invitation #plus-one-fields").addClass('d-none');
    }

    $(window).trigger("debouncedresize");
  });

  $("form#invitation input[name=come_with_plus_one]").on('input', function (e) {
    $("form#invitation #plus-one-fields").toggleClass('d-none');
    $(window).trigger("debouncedresize");
  });


  $("form#invitation button").click(function (e) {
    const form = {};

    $($("form#invitation")).serializeArray()
           .forEach(item => form[item['name']] = item['value']);

    $("#loader").removeClass("d-none");

    $.post({
      url: '/api/rsvp',
      data: form
    }).then((res) => {
      document.querySelector("#invitation").reset();
      $("form#invitation .message-success").text(res.message);
      $("#loader").addClass("d-none");
    }).catch((err) => {
      $("#loader").addClass("d-none");

      const errors = err.responseJSON;

      Object.keys(errors)
            .forEach(error => {
              const id = `#${error}_error`.replace(/\./g, '_');
              $(`form#invitation ${id}`).text(errors[error][0].replace(/plus one./g, ''))
            });
    });
  });
});