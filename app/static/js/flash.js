// https://blog.udemy.com/jquery-settimeout/ - Reference
// Automatically dismiss flash messages after 3 seconds
$(document).ready(function() {
setTimeout(function() {
    $(".alert").alert('close');
}, 3000); // 3000 milliseconds = 3 seconds
});

function togglePasswordVisibility() {
var passwordField = document.getElementById('password');
var eyeIcon = document.getElementById('eyeIcon');

// Toggle the input type between password and text
if (passwordField.type === "password") {
  passwordField.type = "text";
  eyeIcon.classList.remove('fa-eye');
  eyeIcon.classList.add('fa-eye-slash');
} else {
  passwordField.type = "password";
  eyeIcon.classList.remove('fa-eye-slash');
  eyeIcon.classList.add('fa-eye');
}
}

$(document).ready(function () {
    $("button.update-quantity").on("click", function () {
        const itemId = $(this).data("item-id"); // Get the item ID
        const change = parseInt($(this).data("change")); // +1 for increment, -1 for decrement

        // Send AJAX request to update quantity
        $.ajax({
            url: "/update-cart",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ itemId: itemId, change: change }),
            success: function (response) {
                if (response.status === "success") {
                    // Update the quantity and totals dynamically
                    $(`#quantity-${itemId}`).text(response.newQuantity);
                    $(`#total-${itemId}`).text(`£${response.itemTotal.toFixed(2)}`);
                    $("#cart-total").text(`Total: £${response.cartTotal.toFixed(2)}`);
                } else {
                    alert(response.message);
                }
            },
            error: function (xhr) {
                const response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        });
    });
});


$(document).ready(function() {
  // Add to Wishlist
  $('.like-button').on('click', function (e) {
      e.preventDefault();
      const productId = $(this).data('product-id');

      // Check if user is logged in
      if (!window.isAuthenticated) {  // Assume this variable is set from the server-side
          // Use localStorage or sessionStorage for unauthenticated users
          let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
          if (!wishlist.includes(productId)) {
              wishlist.push(productId);
              localStorage.setItem('wishlist', JSON.stringify(wishlist));
              alert('Added to your wishlist!');
          } else {
              alert('Item already in your wishlist!');
          }
      } else {
          // If logged in, make AJAX request to add to the server-side wishlist
          $.ajax({
              url: '/wishlist/add/' + productId,
              method: 'POST',
              success: function(response) {
                  alert(response.message);
              },
              error: function() {
                  alert('There was an error adding the item to the wishlist.');
              }
          });
      }
  });

  // Handle remove from wishlist action
  $('#wishlist-items-container').on('click', '.remove-from-wishlist', function () {
      const productId = $(this).data('product-id');

      if (!window.isAuthenticated) {
          // Remove from local storage for unauthenticated users
          let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
          const index = wishlist.indexOf(productId);
          if (index !== -1) {
              wishlist.splice(index, 1);
              localStorage.setItem('wishlist', JSON.stringify(wishlist));
              alert('Removed from your wishlist!');
              $(this).closest('.wishlist-item').remove(); // Remove item from the page
          }
      } else {
          // For authenticated users, send AJAX request to remove from backend
          $.ajax({
              url: '/wishlist/remove/' + productId,
              method: 'POST',
              success: function(response) {
                  alert(response.message);
                  $(this).closest('.wishlist-item').remove(); // Remove item from the page
              },
              error: function() {
                  alert('Error removing item from wishlist.');
              }
          });
      }
  });
});