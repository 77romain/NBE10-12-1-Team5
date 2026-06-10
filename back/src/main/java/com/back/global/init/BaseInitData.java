package com.back.global.init;

import com.back.domain.product.entity.Product;
import com.back.domain.product.repository.ProductRepository;
import com.back.domain.orderproduct.entity.OrderProduct;
import com.back.domain.orderproduct.repository.OrderProductRepository;
import com.back.domain.order.entity.OrderStatus;
import com.back.domain.order.entity.Order;
import com.back.domain.order.repository.OrderRepository;
import com.back.domain.user.entity.User;
import com.back.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderProductRepository orderProductRepository;

    @Bean
    public CommandLineRunner initData() {
        return new CommandLineRunner() {
            @Override
            @Transactional
            public void run(String @NonNull ... args)  {

                if (productRepository.count() > 0 ||
                        userRepository.count() > 0 ||
                        orderRepository.count() > 0) {
                    return;
                }

                Product product1 = productRepository.save(new Product(
                        "Ethiopia Yirgacheffe",
                        "https://i.postimg.cc/fRXXGg1h/etiopia-yegachepeu.webp",
                        "플로럴, 시트러스 계열의 밝고 산뜻한 에티오피아 원두",
                        1000,
                        253
                ));
                Product product2 = productRepository.save(new Product(
                        "Colombia Huila",
                        "https://i.postimg.cc/bv9nJSyw/kollombia-hwilla.webp",
                        "카라멜, 헤이즐넛 풍미의 균형 잡힌 콜롬비아 원두",
                        3500,
                        236
                ));
                Product product3 = productRepository.save(new Product(
                        "Guatemala Antigua",
                        "https://i.postimg.cc/SsZzL0Yd/gwatemalla-antigua.jpg",
                        "다크초콜릿, 스모키 향의 과테말라 원두",
                        5000,
                        217
                ));
                Product product4 = productRepository.save(new Product(
                        "Brazil Santos",
                        "https://i.postimg.cc/3NV46gB8/beulajil-santoseu.webp",
                        "고소하고 부드러운 브라질 산토스 원두",
                        7500,
                        195
                ));
                Product product5 = productRepository.save(new Product(
                        "Kenya AA",
                        "https://i.postimg.cc/4NHhcSft/Kenya-AA.webp",
                        "자몽, 블랙커런트의 강렬한 산미와 와인 같은 풍미의 케냐 원두",
                        4500,
                        170
                ));
                Product product6 = productRepository.save(new Product(
                        "Costa Rica Tarrazu",
                        "https://i.postimg.cc/wB2tHKVZ/Costa-Rica-Tarrazu.jpg",
                        "깔끔한 산미와 시트러스, 아몬드의 고소함이 어우러진 코스타리카 원두",
                        13000,
                        158
                ));
                Product product7 = productRepository.save(new Product(
                        "Indonesia Sumatra Mandheling",
                        "https://i.postimg.cc/vBm4ZP29/Indonesia-Sumatra-Mandheling.webp",
                        "묵직한 바디감과 흙 내음, 허브 향이 매력적인 인도네시아 원두",
                        9500,
                        131
                ));
                Product product8 = productRepository.save(new Product(
                        "Ethiopia Sidamo",
                        "https://i.postimg.cc/GhDjkQdk/Ethiopia-Sidamo.webp",
                        "베리류의 달콤함과 깊은 꽃향기가 감도는 에티오피아 원두",
                        12000,
                        119
                ));
                Product product9 = productRepository.save(new Product(
                        "Jamaica Blue Mountain",
                        "https://i.postimg.cc/zfxwJ2F1/Jamaica-Blue-Mountain.webp",
                        "부드러운 산미와 쓴맛이 완벽한 조화를 이루는 자메이카 명품 원두",
                        25000,
                        95
                ));
                Product product10 = productRepository.save(new Product(
                        "Tanzania Kilimanjaro",
                        "https://i.postimg.cc/C5qbshTT/Tanzania-Kilimanjaro.webp",
                        "짜릿한 산미와 와인 향, 훌륭한 밸런스를 가진 탄자니아 원두",
                        12500,
                        74
                ));
                Product product11 = productRepository.save(new Product(
                        "El Salvador Bourbon",
                        "https://i.postimg.cc/Kck72NK6/El-Salvador-Bourbon.jpg",
                        "꿀 같은 달콤함과 부드러운 밀크초콜릿 풍미의 엘살바도르 원두",
                        10000,
                        57
                ));

                User user1 = userRepository.save(User.builder()
                        .email("77romain@gmail.com")
                        .address("서울 성동구 성수이로18길 37 1층")
                        .addressDetail("스탠다드브레드")
                        .postcode("04787")
                        .build());

                User user2 = userRepository.save(User.builder()
                        .email("A-Light-Shining-in-Darkness@gmail.com")
                        .address("서울 용산구 신흥로3길 2")
                        .addressDetail("보니스피자펍")
                        .postcode("04338")
                        .build());

                User user3 = userRepository.save(User.builder()
                        .email("Boram-Hwang@gmail.com")
                        .address("서울 마포구 와우산로3길 16")
                        .addressDetail("UNITY RECORD BAR")
                        .postcode("04074")
                        .build());

                User user4 = userRepository.save(User.builder()
                        .email("hyeok314@gmail.com")
                        .address("서울 관악구 남부순환로226길 36")
                        .addressDetail("모즈타파스라운지")
                        .postcode("08788")
                        .build());

                User user5 = userRepository.save(User.builder()
                        .email("piker0925@gmail.com")
                        .address("서울 용산구 신흥로 95")
                        .addressDetail("오잇")
                        .postcode("04337")
                        .build());

                Order order1 = orderRepository.save(new Order(
                        user1,
                        user1.getAddress(),
                        user1.getAddressDetail(),
                        user1.getPostcode(),
                        42500,
                        LocalDate.of(2026, 6, 6)
                ));
                orderProductRepository.save(OrderProduct.builder()
                        .order(order1)
                        .product(product1)
                        .productName(product1.getName())
                        .productPrice(product1.getPrice())
                        .productQuantity(15)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order1)
                        .product(product2)
                        .productName(product2.getName())
                        .productPrice(product2.getPrice())
                        .productQuantity(5)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order1)
                        .product(product3)
                        .productName(product3.getName())
                        .productPrice(product3.getPrice())
                        .productQuantity(2)
                        .build());

                Order order2 = orderRepository.save(new Order(
                        user2,
                        user2.getAddress(),
                        user2.getAddressDetail(),
                        user2.getPostcode(),
                        114000,
                        LocalDate.of(2026, 6, 6)
                ));
                orderProductRepository.save(OrderProduct.builder()
                        .order(order2)
                        .product(product4)
                        .productName(product4.getName())
                        .productPrice(product4.getPrice())
                        .productQuantity(8)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order2)
                        .product(product5)
                        .productName(product5.getName())
                        .productPrice(product5.getPrice())
                        .productQuantity(12)
                        .build());

                Order order3 = orderRepository.save(new Order(
                        user3,
                        user3.getAddress(),
                        user3.getAddressDetail(),
                        user3.getPostcode(),
                        109000,
                        LocalDate.of(2026, 6, 5)
                ));
                orderProductRepository.save(OrderProduct.builder()
                        .order(order3)
                        .product(product6)
                        .productName(product6.getName())
                        .productPrice(product6.getPrice())
                        .productQuantity(4)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order3)
                        .product(product7)
                        .productName(product7.getName())
                        .productPrice(product7.getPrice())
                        .productQuantity(6)
                        .build());

                Order order4 = orderRepository.save(new Order(
                        user4,
                        user4.getAddress(),
                        user4.getAddressDetail(),
                        user4.getPostcode(),
                        60000,
                        LocalDate.of(2026, 6, 5)
                ));
                orderProductRepository.save(OrderProduct.builder()
                        .order(order4)
                        .product(product8)
                        .productName(product8.getName())
                        .productPrice(product8.getPrice())
                        .productQuantity(5)
                        .build());

                Order order5 = orderRepository.save(new Order(
                        user5,
                        user5.getAddress(),
                        user5.getAddressDetail(),
                        user5.getPostcode(),
                        160000,
                        LocalDate.of(2026, 6, 4)
                ));
                orderProductRepository.save(OrderProduct.builder()
                        .order(order5)
                        .product(product9)
                        .productName(product9.getName())
                        .productPrice(product9.getPrice())
                        .productQuantity(2)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order5)
                        .product(product10)
                        .productName(product10.getName())
                        .productPrice(product10.getPrice())
                        .productQuantity(4)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order5)
                        .product(product11)
                        .productName(product11.getName())
                        .productPrice(product11.getPrice())
                        .productQuantity(6)
                        .build());

                Order order6 = orderRepository.save(new Order(
                        user1,
                        user1.getAddress(),
                        user1.getAddressDetail(),
                        user1.getPostcode(),
                        95000,
                        LocalDate.of(2026, 6, 3)
                ));
                order6.modifyStatus(OrderStatus.DELIVERED);
                orderRepository.save(order6);
                orderProductRepository.save(OrderProduct.builder()
                        .order(order6)
                        .product(product1)
                        .productName(product1.getName())
                        .productPrice(product1.getPrice())
                        .productQuantity(20)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order6)
                        .product(product4)
                        .productName(product4.getName())
                        .productPrice(product4.getPrice())
                        .productQuantity(10)
                        .build());

                Order order7 = orderRepository.save(new Order(
                        user2,
                        user2.getAddress(),
                        user2.getAddressDetail(),
                        user2.getPostcode(),
                        152500,
                        LocalDate.of(2026, 6, 2)
                ));
                order7.modifyStatus(OrderStatus.DELIVERED);
                orderRepository.save(order7);
                orderProductRepository.save(OrderProduct.builder()
                        .order(order7)
                        .product(product2)
                        .productName(product2.getName())
                        .productPrice(product2.getPrice())
                        .productQuantity(15)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order7)
                        .product(product9)
                        .productName(product9.getName())
                        .productPrice(product9.getPrice())
                        .productQuantity(4)
                        .build());

                Order order8 = orderRepository.save(new Order(
                        user3,
                        user3.getAddress(),
                        user3.getAddressDetail(),
                        user3.getPostcode(),
                        102500,
                        LocalDate.of(2026, 6, 1)
                ));
                order8.modifyStatus(OrderStatus.CANCELED);
                orderRepository.save(order8);
                orderProductRepository.save(OrderProduct.builder()
                        .order(order8)
                        .product(product3)
                        .productName(product3.getName())
                        .productPrice(product3.getPrice())
                        .productQuantity(8)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order8)
                        .product(product10)
                        .productName(product10.getName())
                        .productPrice(product10.getPrice())
                        .productQuantity(5)
                        .build());

                Order order9 = orderRepository.save(new Order(
                        user4,
                        user4.getAddress(),
                        user4.getAddressDetail(),
                        user4.getPostcode(),
                        190000,
                        LocalDate.of(2026, 5, 30)
                ));
                order9.modifyStatus(OrderStatus.CANCELED);
                orderRepository.save(order9);
                orderProductRepository.save(OrderProduct.builder()
                        .order(order9)
                        .product(product5)
                        .productName(product5.getName())
                        .productPrice(product5.getPrice())
                        .productQuantity(20)
                        .build());
                orderProductRepository.save(OrderProduct.builder()
                        .order(order9)
                        .product(product11)
                        .productName(product11.getName())
                        .productPrice(product11.getPrice())
                        .productQuantity(10)
                        .build());

                // ── 추가 사용자 (user6 ~ user10) ──
                User user6 = userRepository.save(User.builder()
                        .email("sooyeon.kim@gmail.com")
                        .address("서울 송파구 올림픽로 300")
                        .addressDetail("롯데월드타워 15층")
                        .postcode("05551")
                        .build());
                User user7 = userRepository.save(User.builder()
                        .email("minjae.park@naver.com")
                        .address("서울 강남구 테헤란로 427")
                        .addressDetail("위워크 10층")
                        .postcode("06159")
                        .build());
                User user8 = userRepository.save(User.builder()
                        .email("jiwon.lee@kakao.com")
                        .address("부산 해운대구 센텀중앙로 55")
                        .addressDetail("센텀시티 3층")
                        .postcode("48058")
                        .build());
                User user9 = userRepository.save(User.builder()
                        .email("haerin.choi@daum.net")
                        .address("인천 연수구 송도과학로 32")
                        .addressDetail("송도컨벤시아 2층")
                        .postcode("21990")
                        .build());
                User user10 = userRepository.save(User.builder()
                        .email("donghun.yoon@gmail.com")
                        .address("대구 중구 동성로2길 21")
                        .addressDetail("패션타운 B1")
                        .postcode("41944")
                        .build());

                // ── 4월 주문 (order10 ~ order19) ──
                Order order10 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 20500, LocalDate.of(2026, 4, 3)));
                order10.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order10);
                orderProductRepository.save(OrderProduct.builder().order(order10).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(10).build());
                orderProductRepository.save(OrderProduct.builder().order(order10).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(3).build());

                Order order11 = orderRepository.save(new Order(user7, user7.getAddress(), user7.getAddressDetail(), user7.getPostcode(), 35000, LocalDate.of(2026, 4, 5)));
                order11.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order11);
                orderProductRepository.save(OrderProduct.builder().order(order11).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(4).build());
                orderProductRepository.save(OrderProduct.builder().order(order11).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(2).build());

                Order order12 = orderRepository.save(new Order(user8, user8.getAddress(), user8.getAddressDetail(), user8.getPostcode(), 37500, LocalDate.of(2026, 4, 8)));
                order12.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order12);
                orderProductRepository.save(OrderProduct.builder().order(order12).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(15).build());
                orderProductRepository.save(OrderProduct.builder().order(order12).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(5).build());

                Order order13 = orderRepository.save(new Order(user9, user9.getAddress(), user9.getAddressDetail(), user9.getPostcode(), 54500, LocalDate.of(2026, 4, 11)));
                order13.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order13);
                orderProductRepository.save(OrderProduct.builder().order(order13).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(2).build());
                orderProductRepository.save(OrderProduct.builder().order(order13).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(3).build());

                Order order14 = orderRepository.save(new Order(user10, user10.getAddress(), user10.getAddressDetail(), user10.getPostcode(), 40000, LocalDate.of(2026, 4, 14)));
                order14.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order14);
                orderProductRepository.save(OrderProduct.builder().order(order14).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order14).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(12).build());

                Order order15 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 61000, LocalDate.of(2026, 4, 17)));
                order15.modifyStatus(OrderStatus.CANCELED); orderRepository.save(order15);
                orderProductRepository.save(OrderProduct.builder().order(order15).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(3).build());
                orderProductRepository.save(OrderProduct.builder().order(order15).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(1).build());

                Order order16 = orderRepository.save(new Order(user7, user7.getAddress(), user7.getAddressDetail(), user7.getPostcode(), 62500, LocalDate.of(2026, 4, 21)));
                order16.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order16);
                orderProductRepository.save(OrderProduct.builder().order(order16).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(5).build());
                orderProductRepository.save(OrderProduct.builder().order(order16).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(2).build());

                Order order17 = orderRepository.save(new Order(user8, user8.getAddress(), user8.getAddressDetail(), user8.getPostcode(), 35000, LocalDate.of(2026, 4, 24)));
                order17.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order17);
                orderProductRepository.save(OrderProduct.builder().order(order17).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(20).build());
                orderProductRepository.save(OrderProduct.builder().order(order17).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(3).build());

                Order order18 = orderRepository.save(new Order(user9, user9.getAddress(), user9.getAddressDetail(), user9.getPostcode(), 67000, LocalDate.of(2026, 4, 27)));
                order18.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order18);
                orderProductRepository.save(OrderProduct.builder().order(order18).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(6).build());
                orderProductRepository.save(OrderProduct.builder().order(order18).product(product11).productName(product11.getName()).productPrice(product11.getPrice()).productQuantity(4).build());

                Order order19 = orderRepository.save(new Order(user10, user10.getAddress(), user10.getAddressDetail(), user10.getPostcode(), 48000, LocalDate.of(2026, 4, 30)));
                order19.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order19);
                orderProductRepository.save(OrderProduct.builder().order(order19).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(10).build());
                orderProductRepository.save(OrderProduct.builder().order(order19).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(1).build());

                // ── 5월 주문 (order20 ~ order39) ──
                Order order20 = orderRepository.save(new Order(user1, user1.getAddress(), user1.getAddressDetail(), user1.getPostcode(), 30500, LocalDate.of(2026, 5, 2)));
                order20.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order20);
                orderProductRepository.save(OrderProduct.builder().order(order20).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order20).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(3).build());

                Order order21 = orderRepository.save(new Order(user2, user2.getAddress(), user2.getAddressDetail(), user2.getPostcode(), 35500, LocalDate.of(2026, 5, 4)));
                order21.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order21);
                orderProductRepository.save(OrderProduct.builder().order(order21).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(5).build());
                orderProductRepository.save(OrderProduct.builder().order(order21).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(4).build());

                Order order22 = orderRepository.save(new Order(user3, user3.getAddress(), user3.getAddressDetail(), user3.getPostcode(), 62000, LocalDate.of(2026, 5, 6)));
                order22.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order22);
                orderProductRepository.save(OrderProduct.builder().order(order22).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(4).build());
                orderProductRepository.save(OrderProduct.builder().order(order22).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(2).build());

                Order order23 = orderRepository.save(new Order(user4, user4.getAddress(), user4.getAddressDetail(), user4.getPostcode(), 46000, LocalDate.of(2026, 5, 8)));
                order23.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order23);
                orderProductRepository.save(OrderProduct.builder().order(order23).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(25).build());
                orderProductRepository.save(OrderProduct.builder().order(order23).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(6).build());

                Order order24 = orderRepository.save(new Order(user5, user5.getAddress(), user5.getAddressDetail(), user5.getPostcode(), 87500, LocalDate.of(2026, 5, 10)));
                order24.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order24);
                orderProductRepository.save(OrderProduct.builder().order(order24).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(2).build());
                orderProductRepository.save(OrderProduct.builder().order(order24).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(3).build());

                Order order25 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 60000, LocalDate.of(2026, 5, 12)));
                order25.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order25);
                orderProductRepository.save(OrderProduct.builder().order(order25).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(6).build());
                orderProductRepository.save(OrderProduct.builder().order(order25).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(4).build());

                Order order26 = orderRepository.save(new Order(user7, user7.getAddress(), user7.getAddressDetail(), user7.getPostcode(), 52500, LocalDate.of(2026, 5, 14)));
                order26.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order26);
                orderProductRepository.save(OrderProduct.builder().order(order26).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(30).build());
                orderProductRepository.save(OrderProduct.builder().order(order26).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(5).build());

                Order order27 = orderRepository.save(new Order(user8, user8.getAddress(), user8.getAddressDetail(), user8.getPostcode(), 89000, LocalDate.of(2026, 5, 16)));
                order27.modifyStatus(OrderStatus.CANCELED); orderRepository.save(order27);
                orderProductRepository.save(OrderProduct.builder().order(order27).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(3).build());
                orderProductRepository.save(OrderProduct.builder().order(order27).product(product11).productName(product11.getName()).productPrice(product11.getPrice()).productQuantity(5).build());

                Order order28 = orderRepository.save(new Order(user9, user9.getAddress(), user9.getAddressDetail(), user9.getPostcode(), 62000, LocalDate.of(2026, 5, 18)));
                order28.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order28);
                orderProductRepository.save(OrderProduct.builder().order(order28).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(12).build());
                orderProductRepository.save(OrderProduct.builder().order(order28).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(4).build());

                Order order29 = orderRepository.save(new Order(user10, user10.getAddress(), user10.getAddressDetail(), user10.getPostcode(), 73500, LocalDate.of(2026, 5, 20)));
                order29.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order29);
                orderProductRepository.save(OrderProduct.builder().order(order29).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(6).build());
                orderProductRepository.save(OrderProduct.builder().order(order29).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(3).build());

                Order order30 = orderRepository.save(new Order(user1, user1.getAddress(), user1.getAddressDetail(), user1.getPostcode(), 42000, LocalDate.of(2026, 5, 22)));
                order30.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order30);
                orderProductRepository.save(OrderProduct.builder().order(order30).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(18).build());
                orderProductRepository.save(OrderProduct.builder().order(order30).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(2).build());

                Order order31 = orderRepository.save(new Order(user2, user2.getAddress(), user2.getAddressDetail(), user2.getPostcode(), 61000, LocalDate.of(2026, 5, 24)));
                order31.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order31);
                orderProductRepository.save(OrderProduct.builder().order(order31).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order31).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(1).build());

                Order order32 = orderRepository.save(new Order(user3, user3.getAddress(), user3.getAddressDetail(), user3.getPostcode(), 74500, LocalDate.of(2026, 5, 25)));
                order32.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order32);
                orderProductRepository.save(OrderProduct.builder().order(order32).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(7).build());
                orderProductRepository.save(OrderProduct.builder().order(order32).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(4).build());

                Order order33 = orderRepository.save(new Order(user4, user4.getAddress(), user4.getAddressDetail(), user4.getPostcode(), 48000, LocalDate.of(2026, 5, 26)));
                order33.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order33);
                orderProductRepository.save(OrderProduct.builder().order(order33).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(22).build());
                orderProductRepository.save(OrderProduct.builder().order(order33).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(2).build());

                Order order34 = orderRepository.save(new Order(user5, user5.getAddress(), user5.getAddressDetail(), user5.getPostcode(), 85000, LocalDate.of(2026, 5, 27)));
                order34.modifyStatus(OrderStatus.CANCELED); orderRepository.save(order34);
                orderProductRepository.save(OrderProduct.builder().order(order34).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(5).build());
                orderProductRepository.save(OrderProduct.builder().order(order34).product(product11).productName(product11.getName()).productPrice(product11.getPrice()).productQuantity(6).build());

                Order order35 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 98000, LocalDate.of(2026, 5, 28)));
                order35.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order35);
                orderProductRepository.save(OrderProduct.builder().order(order35).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order35).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(4).build());

                Order order36 = orderRepository.save(new Order(user7, user7.getAddress(), user7.getAddressDetail(), user7.getPostcode(), 42000, LocalDate.of(2026, 5, 29)));
                order36.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order36);
                orderProductRepository.save(OrderProduct.builder().order(order36).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(15).build());
                orderProductRepository.save(OrderProduct.builder().order(order36).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(6).build());

                Order order37 = orderRepository.save(new Order(user8, user8.getAddress(), user8.getAddressDetail(), user8.getPostcode(), 86000, LocalDate.of(2026, 5, 30)));
                order37.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order37);
                orderProductRepository.save(OrderProduct.builder().order(order37).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(3).build());
                orderProductRepository.save(OrderProduct.builder().order(order37).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(2).build());

                Order order38 = orderRepository.save(new Order(user9, user9.getAddress(), user9.getAddressDetail(), user9.getPostcode(), 69000, LocalDate.of(2026, 5, 31)));
                order38.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order38);
                orderProductRepository.save(OrderProduct.builder().order(order38).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(9).build());
                orderProductRepository.save(OrderProduct.builder().order(order38).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(5).build());

                Order order39 = orderRepository.save(new Order(user10, user10.getAddress(), user10.getAddressDetail(), user10.getPostcode(), 25000, LocalDate.of(2026, 5, 31)));
                order39.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order39);
                orderProductRepository.save(OrderProduct.builder().order(order39).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(10).build());
                orderProductRepository.save(OrderProduct.builder().order(order39).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(3).build());

                // ── 6월 추가 주문 (order40 ~ order69) ──
                Order order40 = orderRepository.save(new Order(user4, user4.getAddress(), user4.getAddressDetail(), user4.getPostcode(), 43500, LocalDate.of(2026, 6, 1)));
                order40.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order40);
                orderProductRepository.save(OrderProduct.builder().order(order40).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(4).build());
                orderProductRepository.save(OrderProduct.builder().order(order40).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(3).build());

                Order order41 = orderRepository.save(new Order(user5, user5.getAddress(), user5.getAddressDetail(), user5.getPostcode(), 48000, LocalDate.of(2026, 6, 1)));
                orderProductRepository.save(OrderProduct.builder().order(order41).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(20).build());
                orderProductRepository.save(OrderProduct.builder().order(order41).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(8).build());

                Order order42 = orderRepository.save(new Order(user5, user5.getAddress(), user5.getAddressDetail(), user5.getPostcode(), 73500, LocalDate.of(2026, 6, 2)));
                order42.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order42);
                orderProductRepository.save(OrderProduct.builder().order(order42).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(2).build());
                orderProductRepository.save(OrderProduct.builder().order(order42).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(5).build());

                Order order43 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 57000, LocalDate.of(2026, 6, 2)));
                orderProductRepository.save(OrderProduct.builder().order(order43).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(12).build());
                orderProductRepository.save(OrderProduct.builder().order(order43).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(6).build());

                Order order44 = orderRepository.save(new Order(user4, user4.getAddress(), user4.getAddressDetail(), user4.getPostcode(), 50000, LocalDate.of(2026, 6, 3)));
                order44.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order44);
                orderProductRepository.save(OrderProduct.builder().order(order44).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(10).build());
                orderProductRepository.save(OrderProduct.builder().order(order44).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(3).build());

                Order order45 = orderRepository.save(new Order(user5, user5.getAddress(), user5.getAddressDetail(), user5.getPostcode(), 73000, LocalDate.of(2026, 6, 3)));
                orderProductRepository.save(OrderProduct.builder().order(order45).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(4).build());
                orderProductRepository.save(OrderProduct.builder().order(order45).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(1).build());

                Order order46 = orderRepository.save(new Order(user1, user1.getAddress(), user1.getAddressDetail(), user1.getPostcode(), 61000, LocalDate.of(2026, 6, 4)));
                order46.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order46);
                orderProductRepository.save(OrderProduct.builder().order(order46).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(25).build());
                orderProductRepository.save(OrderProduct.builder().order(order46).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(8).build());

                Order order47 = orderRepository.save(new Order(user2, user2.getAddress(), user2.getAddressDetail(), user2.getPostcode(), 87500, LocalDate.of(2026, 6, 4)));
                orderProductRepository.save(OrderProduct.builder().order(order47).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(3).build());
                orderProductRepository.save(OrderProduct.builder().order(order47).product(product11).productName(product11.getName()).productPrice(product11.getPrice()).productQuantity(5).build());

                Order order48 = orderRepository.save(new Order(user1, user1.getAddress(), user1.getAddressDetail(), user1.getPostcode(), 82500, LocalDate.of(2026, 6, 5)));
                order48.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order48);
                orderProductRepository.save(OrderProduct.builder().order(order48).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(15).build());
                orderProductRepository.save(OrderProduct.builder().order(order48).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(4).build());

                Order order49 = orderRepository.save(new Order(user2, user2.getAddress(), user2.getAddressDetail(), user2.getPostcode(), 43000, LocalDate.of(2026, 6, 5)));
                orderProductRepository.save(OrderProduct.builder().order(order49).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(18).build());
                orderProductRepository.save(OrderProduct.builder().order(order49).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(5).build());

                Order order50 = orderRepository.save(new Order(user3, user3.getAddress(), user3.getAddressDetail(), user3.getPostcode(), 77000, LocalDate.of(2026, 6, 6)));
                order50.modifyStatus(OrderStatus.DELIVERED); orderRepository.save(order50);
                orderProductRepository.save(OrderProduct.builder().order(order50).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(3).build());
                orderProductRepository.save(OrderProduct.builder().order(order50).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(4).build());

                Order order51 = orderRepository.save(new Order(user4, user4.getAddress(), user4.getAddressDetail(), user4.getPostcode(), 78000, LocalDate.of(2026, 6, 6)));
                orderProductRepository.save(OrderProduct.builder().order(order51).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order51).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(2).build());

                Order order52 = orderRepository.save(new Order(user1, user1.getAddress(), user1.getAddressDetail(), user1.getPostcode(), 67500, LocalDate.of(2026, 6, 7)));
                orderProductRepository.save(OrderProduct.builder().order(order52).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(30).build());
                orderProductRepository.save(OrderProduct.builder().order(order52).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(5).build());

                Order order53 = orderRepository.save(new Order(user2, user2.getAddress(), user2.getAddressDetail(), user2.getPostcode(), 81000, LocalDate.of(2026, 6, 7)));
                orderProductRepository.save(OrderProduct.builder().order(order53).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(10).build());
                orderProductRepository.save(OrderProduct.builder().order(order53).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(3).build());

                Order order54 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 77500, LocalDate.of(2026, 6, 7)));
                orderProductRepository.save(OrderProduct.builder().order(order54).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(6).build());
                orderProductRepository.save(OrderProduct.builder().order(order54).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(5).build());

                Order order55 = orderRepository.save(new Order(user3, user3.getAddress(), user3.getAddressDetail(), user3.getPostcode(), 92000, LocalDate.of(2026, 6, 8)));
                orderProductRepository.save(OrderProduct.builder().order(order55).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(12).build());
                orderProductRepository.save(OrderProduct.builder().order(order55).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(4).build());

                Order order56 = orderRepository.save(new Order(user4, user4.getAddress(), user4.getAddressDetail(), user4.getPostcode(), 46000, LocalDate.of(2026, 6, 8)));
                orderProductRepository.save(OrderProduct.builder().order(order56).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(20).build());
                orderProductRepository.save(OrderProduct.builder().order(order56).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(2).build());

                Order order57 = orderRepository.save(new Order(user7, user7.getAddress(), user7.getAddressDetail(), user7.getPostcode(), 120000, LocalDate.of(2026, 6, 8)));
                orderProductRepository.save(OrderProduct.builder().order(order57).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order57).product(product11).productName(product11.getName()).productPrice(product11.getPrice()).productQuantity(6).build());

                Order order58 = orderRepository.save(new Order(user5, user5.getAddress(), user5.getAddressDetail(), user5.getPostcode(), 46500, LocalDate.of(2026, 6, 9)));
                orderProductRepository.save(OrderProduct.builder().order(order58).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(15).build());
                orderProductRepository.save(OrderProduct.builder().order(order58).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(7).build());

                Order order59 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 67500, LocalDate.of(2026, 6, 9)));
                orderProductRepository.save(OrderProduct.builder().order(order59).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(9).build());
                orderProductRepository.save(OrderProduct.builder().order(order59).product(product8).productName(product8.getName()).productPrice(product8.getPrice()).productQuantity(3).build());

                Order order60 = orderRepository.save(new Order(user8, user8.getAddress(), user8.getAddressDetail(), user8.getPostcode(), 72500, LocalDate.of(2026, 6, 9)));
                orderProductRepository.save(OrderProduct.builder().order(order60).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(1).build());
                orderProductRepository.save(OrderProduct.builder().order(order60).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(5).build());

                Order order61 = orderRepository.save(new Order(user9, user9.getAddress(), user9.getAddressDetail(), user9.getPostcode(), 82500, LocalDate.of(2026, 6, 9)));
                orderProductRepository.save(OrderProduct.builder().order(order61).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(6).build());
                orderProductRepository.save(OrderProduct.builder().order(order61).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(3).build());

                Order order62 = orderRepository.save(new Order(user1, user1.getAddress(), user1.getAddressDetail(), user1.getPostcode(), 70000, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order62).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(25).build());
                orderProductRepository.save(OrderProduct.builder().order(order62).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(6).build());

                Order order63 = orderRepository.save(new Order(user2, user2.getAddress(), user2.getAddressDetail(), user2.getPostcode(), 69000, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order63).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(14).build());
                orderProductRepository.save(OrderProduct.builder().order(order63).product(product3).productName(product3.getName()).productPrice(product3.getPrice()).productQuantity(4).build());

                Order order64 = orderRepository.save(new Order(user3, user3.getAddress(), user3.getAddressDetail(), user3.getPostcode(), 76000, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order64).product(product6).productName(product6.getName()).productPrice(product6.getPrice()).productQuantity(2).build());
                orderProductRepository.save(OrderProduct.builder().order(order64).product(product9).productName(product9.getName()).productPrice(product9.getPrice()).productQuantity(2).build());

                Order order65 = orderRepository.save(new Order(user6, user6.getAddress(), user6.getAddressDetail(), user6.getPostcode(), 57500, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order65).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(10).build());
                orderProductRepository.save(OrderProduct.builder().order(order65).product(product7).productName(product7.getName()).productPrice(product7.getPrice()).productQuantity(5).build());

                Order order66 = orderRepository.save(new Order(user7, user7.getAddress(), user7.getAddressDetail(), user7.getPostcode(), 73500, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order66).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order66).product(product10).productName(product10.getName()).productPrice(product10.getPrice()).productQuantity(3).build());

                Order order67 = orderRepository.save(new Order(user8, user8.getAddress(), user8.getAddressDetail(), user8.getPostcode(), 51000, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order67).product(product2).productName(product2.getName()).productPrice(product2.getPrice()).productQuantity(6).build());
                orderProductRepository.save(OrderProduct.builder().order(order67).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(4).build());

                Order order68 = orderRepository.save(new Order(user9, user9.getAddress(), user9.getAddressDetail(), user9.getPostcode(), 100000, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order68).product(product11).productName(product11.getName()).productPrice(product11.getPrice()).productQuantity(8).build());
                orderProductRepository.save(OrderProduct.builder().order(order68).product(product1).productName(product1.getName()).productPrice(product1.getPrice()).productQuantity(20).build());

                Order order69 = orderRepository.save(new Order(user10, user10.getAddress(), user10.getAddressDetail(), user10.getPostcode(), 75000, LocalDate.of(2026, 6, 10)));
                orderProductRepository.save(OrderProduct.builder().order(order69).product(product4).productName(product4.getName()).productPrice(product4.getPrice()).productQuantity(7).build());
                orderProductRepository.save(OrderProduct.builder().order(order69).product(product5).productName(product5.getName()).productPrice(product5.getPrice()).productQuantity(5).build());
            }
        };
    }
}
