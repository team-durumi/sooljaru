$('a.btn_7fa1e8474f5e9').on('click', function(e) {
  e.preventDefault();
  pay_subscription();
});

$('#w202010307ecd272f04c20 .cf01 label[for="sub_box01_01"]').on('click', function(e) {
  e.preventDefault();
  pay_subscription();
});

var pay_subscription = function() {
  // console.log('bootpay clicked');
  var endpoint_hostname = "//api.sooljaru.com";
  var current_date = Date.now();
  var order_id = 'sooljaru_' + current_date;

  var imweb_get_user_data_url = '//sooljaru.com/dialog/join.cm';
  $.post( imweb_get_user_data_url, function( data ) {
    var el = $( '<div></div>' );
    el.html(data);
    // console.log(el);
    var form = el.find('article #join_form');
    // console.log(form);
    var email = form.find('input[type="email"]').val();
    var name = form.find('#join_name').val();
    var phone = form.find('#join_callnum').val();
    var address = form.find('#join_addr').val();
    var address_detail = form.find('#join_addr_detail').val();
    var postal_code = form.find('#join_addr_postcode').val();
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
          // console.log('Billing key data is present in the api server ');
          alert('이미 정기구독을 신청하셨습니다. 변경을 원하시면 개별문의 부탁드립니다.');
        } else {
          BootPay.request({
            price: 0, // 0으로 해야 한다.
            application_id: "5f6062604f74b40020e35b53",
            name: '술자루 구독결제', //결제창에서 보여질 이름
            pg: 'payapp',
            method: 'card_rebill', // 빌링키를 받기 위한 결제 수단
            show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
            user_info: {
              username: name,
              email: email,
              addr: address,
              phone: phone
            },
            order_id: order_id, //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
            params: {callback1: '그대로 콜백받을 변수 1', callback2: '그대로 콜백받을 변수 2', order_id: order_id },
            extra: {
              start_at: current_date, // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
              end_at: current_date + 1 // 정기결제 만료일 -  기간 없음 - 무제한
            }
          }).error(function (data) {
            //결제 진행시 에러가 발생하면 수행됩니다.
            // console.log('error');
            alert('구독신청중 에러가 발생했습니다. 다시 시도해주세요.');
            // console.log(data);
          }).cancel(function (data) {
            //결제가 취소되면 수행됩니다.
            // console.log('cancel');
            alert('결제가 취소되었습니다.');
            // console.log(data);
          }).done(function (data) {
            // 빌링키를 정상적으로 가져오면 해당 데이터를 불러옵니다.
            // console.log('billing key issued.');
            // console.log(data);
            var billing_key = data["billing_key"];
            var c_at = data["c_at"];
            var e_at = data["e_at"];

            var endpoint = endpoint_hostname + "/api/subscription_infos";
            var post_data = {
              "subscription_info": {
                "name": name,
                "email": email,
                "address": address,
                "address_detail": address_detail,
                "postal_code": postal_code,
                "phone": phone,
                "order_id": order_id,
                "billing_key": billing_key,
                "bootpay_c_at": c_at,
                "bootpay_e_at": e_at,
                "imweb_idx": idx
              }
            }
            // console.log(post_data);
            $.post(endpoint, post_data, function(data) {
              // console.log(data);
              if (data.is_success === true) {
                console.log('빌링키 저장 성공');
                alert('구독결제를 위한 카드정보가 저장되었습니다.');
                // console.log(data);
              } else {
                // console.log('빌링키 저장 실패');
                alert('구독신청중 에러가 발생했습니다. 다시 시도해주세요.');
                // console.log(data);
              }
            });
          });
        }
      });
    } else {
      alert('로그인 후에 주문이 가능합니다.');
    }
  });
}
