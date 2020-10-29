$('a.btn_7fa1e8474f5e9').on('click', function(e) {
  e.preventDefault();
  // console.log('bootpay clicked');
  var order_id = 'sooljaru_' + Date.now();
  var url = '//sooljaru.com/dialog/join.cm';
  $.post( url, function( data ) {
    var el = $( '<div></div>' );
    el.html(data);
    // console.log(el);
    var form = el.find('article #join_form');
    // console.log(form);
    var email = form.find('input[type="email"]').val();
    var name = form.find('#join_name').val();
    var phone = form.find('#join_callnum').val();
    var address = form.find('#join_addr').val();
    // console.log(email);
    // console.log(name);
    // console.log(phone);
    // console.log(address);
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
        start_at: '', // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
        end_at: '' // 정기결제 만료일 -  기간 없음 - 무제한
      }
    }).error(function (data) {
      //결제 진행시 에러가 발생하면 수행됩니다.
      console.log('error');
      alert('결제 도중 에러가 발생했습니다. 다시 시도해주세요.');
      // console.log(data);
    }).cancel(function (data) {
      //결제가 취소되면 수행됩니다.
      console.log('cancel');
      alert('결제가 취소되었습니다.');
      // console.log(data);
    }).done(function (data) {
      // 빌링키를 정상적으로 가져오면 해당 데이터를 불러옵니다.
      console.log('billing key issued.');
      // console.log(data);
      var billing_key = data["billing_key"];
      var c_at = data["c_at"];

      var endpoint = "//api.sooljaru.com/api/subscription_infos";
      var post_data = {
        "subscription_info": {
          "name": name,
          "email": email,
          "address": address,
          "phone": phone,
          "order_id": order_id,
          "billing_key": billing_key,
          "bootpay_c_at": c_at
        }
      }
      console.log(post_data);
      $.post(endpoint, post_data, function(data) {
        // console.log(data);
        var response_data = JSON.parse(data);
        // console.log(response_data);
        if (response_data.is_success === true) {
          console.log('빌링키 저장 성공');
        } else {
          console.log('빌링키 저장 실패');
        }
      });
    });
  });
});
