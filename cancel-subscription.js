$('.btn_7fa1e8474f5e9').on('click', function(e) {
  e.preventDefault();
  cancel_subscription();
});

var cancel_subscription = function() {
  var endpoint_hostname = "//api.sooljaru.com";
  var imweb_get_user_data_url = '//sooljaru.com/dialog/join.cm';
  $.post( imweb_get_user_data_url, function( data ) {
    var el = $( '<div></div>' );
    el.html(data);
    // console.log(el);
    var form = el.find('article #join_form');
    // console.log(form);
    // var email = form.find('input[type="email"]').val();
    // var name = form.find('#join_name').val();
    // var phone = form.find('#join_callnum').val();
    // var address = form.find('#join_addr').val();
    // var address_detail = form.find('#join_addr_detail').val();
    // var postal_code = form.find('#join_addr_postcode').val();
    var idx = form.find('input[name="idx"]').val();
    // console.log(email);
    // console.log(name);
    // console.log(phone);
    // console.log(address);
    // console.log(address_detail);
    // console.log(postal_code);
    // console.log(idx);

    var user_present = (idx !== '');
    // var user_present = email !== '' && name !== '' && phone !== '' && address !== '' && address_detail !== '' && postal_code !== '' && idx !== '';
    // console.log(user_present);
    if ( user_present ) {
      var idx_check_endpoint = endpoint_hostname + "/api/subscription_infos/check_idx";
      // console.log(idx_check_endpoint);
      var idx_data = {"imweb_idx": idx};
      // console.log(idx_data);
      $.post(idx_check_endpoint, idx_data, function(data) {
        // console.log(data);
        if (data.idx_presence === true) {
          var cancel_subscription_endpoint = endpoint_hostname + "/api/subscription_infos/cancel_subscription"
          $.post(cancel_subscription_endpoint, idx_data, function(data) {
            console.log(data);
            if (data.billing_key_persistence === true) {
              alert('오류가 있습니다. 재시도하거나 관리자에게 문의해주세요.');
            } else {
              alert('정기결제 정보가 성공적으로 만료되었습니다');
            }
          });
        } else {
          alert('정기구독 신청내역이 없습니다.');
        }
      });
    } else {
      alert('로그인이 필요합니다.');
    }
  });
}