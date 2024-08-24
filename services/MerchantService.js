const product = require('../utils/AxiosService');
const merchantIdSet = new Set([
    '3382',
    '25003',
    '35300',
    '36145',
    '37205',
    '37389',
    '37812',
    '37981',
    '39322',
    '40094',
    '40984',
    '41094',
    '41132',
    '42094',
    '42198',
    '42623',
    '42865',
    '43172',
    '43322',
    '47730',
    '48090',
    '50016',
    '13581',
    '36160',
    '38268',
    '38469',
    '38664',
    '39467',
    '39670',
    '39866',
    '39869',
    '40099',
    '40214',
    '41584',
    '42536',
    '42946',
    '43034',
    '43381',
    '43395',
    '43437',
    '43570',
    '44084',
    '44410',
    '45460',
    '45692',
    '45708',
    '46068',
    '46088',
    '46304',
    '46357',
    '46862',
    '47210',
    '47519',
    '47664',
    '47694',
    '47735',
    '47799',
    '49324',
    '49336',
    '49430',
    '49987',
    '50411',
    '50471',
    '50661',
    '50717',
    '50719',
    '50724',
    '50730',
    '50744',
    '50832',
    '52738',
    '52796',
    '52797',
    '52850',
    '52961',
    '53231']);
const merchantList = `[
  {
    "id": 619,
    "name": "Bloomingdale's",
    "url": "https://bloomingdales.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/347968.gif",
    "description": "Bloomingdale's is a world-famous retailing brand with a reputation for setting fashion trends, showcasing the hottest new designers, and catering to the needs of celebrities. The Bloomingdale's affiliate program offers instant brand-name recognition, a variety of promotional materials, and a 1-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 157993,
    "name": "Kohl's",
    "url": "https://kohls.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/574846.png",
    "description": "Kohl's is a leading retailer with a commitment to inspiring and empowering families to lead fulfilled lives. The store offers amazing national and exclusive brands, incredible savings, and an easy shopping experience in-store, online, and through the Kohl's app. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 158527,
    "name": "NORDSTROM.com",
    "url": "https://nordstrom.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/628238.png",
    "description": "Nordstrom.com features leading apparel, shoe and accessory fashions for men, women, juniors and kids. Customers also enjoy the latest in beauty, personal care, home décor and gifts. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 159390,
    "name": "yoox.com",
    "url": "http://www.yoox.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/671645.jpg",
    "description": "yoox.com offers a wide range of end-of-season clothing and accessories from the world's most prestigious designers, exclusive capsule collections, eco-friendly fashion, and a unique assortment of home design objects. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 159468,
    "name": "LEGO",
    "url": "https://lego.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/675786.gif",
    "description": "LEGO is a world-famous producer of toy bricks that inspires children's creativity through playing and learning. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 161084,
    "name": "Saks Fifth Avenue OFF 5TH",
    "url": "http://saksoff5th.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/880325.PNG",
    "description": "Saks Fifth Avenue OFF 5TH is a major national retailer in its own right and, a compelling place to find the same exceptional deals online. The store provides abundant exclusives, remarkable savings and assortments from the most notable names in fashion. This program offers a 14-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 162750,
    "name": "Banana Republic",
    "url": "https://bananarepublic.gap.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/941844.png",
    "description": "Curious, connected and out in the world, Banana Republic provides a wardrobe of favorites – clothing, eyewear, jewelry, shoes, handbags, and fragrances – all made for a life in motion with the finest materials and fabric innovations. This program offers a 1-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 171105,
    "name": "Alice + Olivia",
    "url": "https://www.aliceandolivia.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1082293.png",
    "description": "Alice + Olivia is a sophisticated brand with a playful sensibility that offers a full women's ready-to-wear collection, which includes outerwear, dresses, and perfectly flattering pants. This program offers a 3-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 171284,
    "name": "Ashley Homestore",
    "url": "https://ashleyfurniture.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1091251.png",
    "description": "Ashley Homestore is passionate about being the most affordable furniture for consumers' homes. The brand designs, builds, and delivers stylish furnishings for every size, space, and taste. In addition, Ashley donates its time, money, and resources every year towards worthy causes. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 172122,
    "name": "The Children's Place",
    "url": "https://childrensplace.com/|pjplace.com/|sugarandjade.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1128376.gif",
    "description": "The Children's Place is a leading specialty retailer of children's merchandise appropriate for newborns up to teens 14 years of age. The Children's Place focuses on outfitting and making the experience of dressing one's child a little easier and much more enjoyable. This program offers a 15-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 177251,
    "name": "Cotton On (US)",
    "url": "https://cottonon.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1376184.jpg",
    "description": "Born to deliver on-trend, effortlessly cool and affordable fashion, Australian brand Cotton On provides women and men the styles they want now. The label is proud to export the laid-back, quintessential modern Australian style to the world. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 181112,
    "name": "DKNY",
    "url": "https://www.dkny.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1679985.png",
    "description": "DKNY is the energy and spirit of New York. International, eclectic, fun, fast and real. DKNY addresses the real-life needs of people everywhere, from work to weekend, jeans to evening. This program offers a 5-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 181293,
    "name": "Hanna Andersson",
    "url": "https://hannaandersson.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1685190.gif",
    "description": "Legendary for its quality that's crafted to last, Hanna Andersson's super soft clothes give babies and kids room to wiggle, play and grow. By caring for kids with comfy cuts, a love of color and eco-friendly fabrics, Hanna makes their world happier and softer. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 188219,
    "name": "Calvin Klein",
    "url": "http://calvinklein.us",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1808897.png",
    "description": "Calvin Klein is a global lifestyle brand that exemplifies bold, progressive details and a seductive, and often minimal, aesthetic. The label seeks to thrill and inspire customers with its collection of apparel and accessories while using provocative imagery and striking designs to ignite the senses. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 188587,
    "name": "The Honest Company",
    "url": "https://honest.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1815368.jpg",
    "description": "The Honest Company is a one-stop shop for the safest products, best service, and most useful tools and information for today's modern families, with the ultimate goal of redefining the family brand by helping to create healthier, happier homes and a better future for all children. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 192065,
    "name": "kidpik",
    "url": "https://shop.kidpik.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/1996741.jpg",
    "description": "Kidpik offers a uniquely designed, limited edition custom fashion collection of premium apparel, footwear, and accessories for girls aged 3-14. The brand combines personal styling with the excitement of unboxing and the convenience of home try-on, allowing girls to create their own unique style profiles and receive customized fashion boxes filled with high-quality clothes, shoes, and accessories. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 196522,
    "name": "Cole Haan",
    "url": "https://colehaan.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/2658840.gif",
    "description": "Cole Haan is built on American craftsmanship and ingenuity. The brand combines traditional methods, timeless style, and modern innovations to create footwear and accessories for optimists of all ages. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 199589,
    "name": "Calzedonia",
    "url": "http://calzedonia.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/3552419.png",
    "description": "Calzedonia is a renowned Italian brand specializing in legwear, beachwear, and socks for women and men. In addition to its high quality products, the brand is known for offering a shopping experience that is everything shoppers want, with express delivery for all orders at an amazing price and free returns. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 200434,
    "name": "Janie and Jack",
    "url": "https://www.janieandjack.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/3694464.jpg",
    "description": "Gymboree, Crazy 8, & Janie and Jack mix kid sensibility with a modern sense of style with  comfort-first promise that let kids be themselves. The three clothing brands all work to create unique looks for kids based on quality and creativity. This program offers a 7-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 201816,
    "name": "H&M (US)",
    "url": "https://www2.hm.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/3874054.png",
    "description": "H&M offers fashion and quality apparel and accessories at low prices and sustainable methods for women, men, and children. The brand's range includes everything from gala outfits and designer collaborations to everyday basics for style enthusiasts worldwide. This program offers a 14-day cookie duration. Please note, this advertiser is only considering Content sites and Influencers at this time.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 203276,
    "name": "Parfums Christian Dior",
    "url": "https://dior.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/4240644.png",
    "description": "Christian Dior was a visionary. Beginning with his first collection in 1947 he rewrote the rules of modern elegance and imposed his style on the entire world. He brought women his vision of beauty and happiness. He showed unprecedented creative originality. This program has a 7-day cookie duration period.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 204122,
    "name": "4moms",
    "url": "https://4moms.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/4384188.jpg",
    "description": "4moms develop dramatically better juvenile products for parents. From cribs and rockers to feeding chairs and accessories, the retailer makes parenting easier and allows customers to better manage their daily routine with infants and toddlers. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 209002,
    "name": "Designer Shoe Warehouse",
    "url": "https://dsw.com",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/4739491.jpg",
    "description": "DSW Designer Shoe Warehouse is the destination for fabulous brands at a great value every single day. With thousands of shoes for women. men, and kids in almost 500 stores and online, DSW is all about finding the perfect shoe at the perfect price. This program offers a 14-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 215781,
    "name": "Kate Spade Outlet",
    "url": "https://www.katespadeoutlet.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/5884761.png",
    "description": "Kate Spade Outlet is an extension of the Kate Spade New York brand and provides users with a way to shop classic Kate Spade high-quality outlet handbags, wallets, jewelry, accessories, and more at amazing prices. there are also new deals almost every day, bundles, special shops to explore, and more! This program offers a 1-day cookie duration period.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 225416,
    "name": "Rent the Runway",
    "url": "https://renttherunway.com/",
    "imageUrl": "https://content.flexlinks.com/sharedimages/programs/6049427.png",
    "description": "Through the Rent the Runway affiliate program, your site visitors will gain access to one if the largest online designer rental destinations changing the way women get dressed. Customers can access a dream closet with hundreds of thousands of styles from a wide range of designer brands meant fit everyone's lifestyle. This program offers a 30-day cookie duration.",
    "country": "US",
    "from": "FLEXOFFER"
  },
  {
    "id": 3382,
    "name": "Florsheim",
    "url": "http://www.florsheim.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_3382.jpg",
    "country": "United States",
    "description": "Leading brand in traditional men’s dress, business and casual footwear. We offer uncompromised high quality  products crafted by industry experts. Known for high customer satisfaction and service. ",
    "from": "LINKSHARE"
  },
  {
    "id": 25003,
    "name": "Neiman Marcus",
    "url": "https://www.neimanmarcus.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_25003.gif",
    "country": "United States",
    "description": "Neiman Marcus has been recognized as the premier luxury retailer, dedicated to providing customers a level of service commensurate with its renowned assortment of fine goods and fashion expertise.",
    "from": "LINKSHARE"
  },
  {
    "id": 35300,
    "name": "Bergdorf Goodman (Neiman Marcus)",
    "url": "http://www.bergdorfgoodman.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_35300.jpg",
    "country": "United States",
    "description": "Standing at the crossroads of fashion at Fifth Avenue and 58th Street in New York City, Bergdorf Goodman is known throughout the world for elegance, luxury, and superior service. Discover all this and more online at bergdorfgoodman.com.",
    "from": "LINKSHARE"
  },
  {
    "id": 36145,
    "name": "7 For All Mankind, a division of DG Premium Brands, LLC",
    "url": "http://www.7forallmankind.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_36145.gif",
    "country": "United States",
    "description": "7 For All Mankind is the leading premium denim lifestyle brand. Founded in Los Angeles, California, 7 For All Mankind has been driving innovation in fashion-forward washes and designs for nearly 20 years.",
    "from": "LINKSHARE"
  },
  {
    "id": 37205,
    "name": "Bloomingdales Canada",
    "url": "http://www.bloomingdales.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_37205.jpg",
    "country": "United States",
    "description": "Bloomingdale's, Like No Other Store in the World, Now Worldwide",
    "from": "LINKSHARE"
  },
  {
    "id": 37389,
    "name": "The Honest Company",
    "url": "http://www.honest.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_37389.jpg",
    "country": "United States",
    "description": "Join The Honest Company's affiliate program to help spread the word about the Honest standard of safety and transparency. The Honest Company is known for innovative, safe formulas and designs on beauty, baby, cleaning products, and more.",
    "from": "LINKSHARE"
  },
  {
    "id": 37812,
    "name": "Ralph Lauren",
    "url": "http://www.ralphlauren.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_37812.jpg",
    "country": "United States",
    "description": "Ralph Lauren has always stood for providing quality products. We were the innovators of lifestyle advertisements that tell a story and the first to create stores that encourage customers to participate in that lifestyle.",
    "from": "LINKSHARE"
  },
  {
    "id": 39322,
    "name": "italist UK",
    "url": "https://www.italist.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_39322.jpg",
    "country": "United States",
    "description": "Italist.com is the worldwide largest offer on-line of fashion luxury goods. Both for men and women we aim to bring the very best of Italian fashion online. More than 150.000 items already, best price in the market, only top fashion brands and new items!",
    "from": "LINKSHARE"
  },
  {
    "id": 40094,
    "name": "Ashley Furniture",
    "url": "https://www.ashleyfurniture.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_40094",
    "country": "United States",
    "description": "Ashley is a website for all your furniture needs. Offering a wide range of furniture in various categories including living, bedroom, dining, home office, outdoor, and home décor, gives you the perfect pieces to complement your space.",
    "from": "LINKSHARE"
  },
  {
    "id": 40984,
    "name": "Kidrobot",
    "url": "https://www.kidrobot.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_40984.png",
    "country": "United States",
    "description": "Kidrobot is acknowledged worldwide as the premier creator and dealer of limited edition art toys. An innovative cross between sculpture, conceptual art and licensed art toys.",
    "from": "LINKSHARE"
  },
  {
    "id": 41094,
    "name": "Cotton On (US)",
    "url": "http://cottonon.com/US",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_41094.jpg",
    "country": "United States",
    "description": "In 23 years, our genuine belief, optimistic spirit and willingness to give it a go has seen us expand into sleepwear, footwear, intimates, active, kids, party and youth wear, as well as stationery and everything in-between.",
    "from": "LINKSHARE"
  },
  {
    "id": 41132,
    "name": "italist US",
    "url": "https://www.italist.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_41132.jpg",
    "country": "United States",
    "description": "Italist.com is the worldwide largest offer on-line of fashion luxury goods. Both for men and women we aim to bring the very best of Italian fashion online. More than 200,000 items already, best price in the market, only top fashion brands and new items!",
    "from": "LINKSHARE"
  },
  {
    "id": 42094,
    "name": "Shoe Palace",
    "url": "https://www.shoepalace.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_42094.gif",
    "country": "United States",
    "description": "Shoe Palace is one of the top destinations for athletic footwear, apparel, and accessories.  We sell the hottest kicks from Nike, Jordan, adidas, Vans, and more.  We are one of the few authorized online dealers of Jordan.  ",
    "from": "LINKSHARE"
  },
  {
    "id": 42623,
    "name": "Splendid",
    "url": "http://www.splendid.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_42623.jpg",
    "country": "United States",
    "description": "At Splendid, we are outfitters of the inspired life. With an effortless aesthetic and thoughtful details, we craft premium clothing made for dressing comfortably and living artfully.",
    "from": "LINKSHARE"
  },
  {
    "id": 42865,
    "name": "Roller Rabbit",
    "url": "www.rollerrabbit.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_42865",
    "country": "United States",
    "description": "Roller Rabbit is an NYC-born lifestyle brand with global reach. We are travel-inspired, offering exotic, sophisticated yet affordable leisurewear, accessories and home goods with a magical touch. ",
    "from": "LINKSHARE"
  },
  {
    "id": 43322,
    "name": "Vilebrequin US",
    "url": "https://www.vilebrequin.com/us/en/home",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_43322.png",
    "country": "United States",
    "description": "Vilebrequin has always cultivated a spirit of refinement and fantasy, staying true to the casual charm the house was founded on in St-Tropez over 40 years ago. Vilebrequin has become a lifestyle brand designing collections for men, women and children.",
    "from": "LINKSHARE"
  },
  {
    "id": 48090,
    "name": "Proudly",
    "url": "https://proudly.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_48090",
    "country": "United States",
    "description": "PROUDLY™ is an accessibly-priced baby body & bum care line uniquely designed for melanated babies. Our products use cleaner, plant-based & functional ingredients. ",
    "from": "LINKSHARE"
  },
  {
    "id": 50016,
    "name": "WJD Exclusives",
    "url": "https://www.wjdexclusives.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50016",
    "country": "United States",
    "description": "WJD Exclusives offers gold & diamond chains, bracelets, earrings, rings & more. Fanatical 24/7 customer support via (888) 885-3935 phone and live-chat. Free fast shipping & returns.",
    "from": "LINKSHARE"
  },
  {
    "id": 13581,
    "name": "Flower.com Flowers",
    "url": "http://www.flower.com/affiliates/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_13581.gif",
    "country": "United States",
    "description": "Very high 20% commission.  Top online florist with attractive product offering.Due to a recent unfair sales tax law, we are no longer able to have or accept affiliates from the state of New York as of June 1, 2008, until it is overturned.",
    "from": "LINKSHARE"
  },
  {
    "id": 36160,
    "name": "A4C",
    "url": "http://www.a4c.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_36160.jpg",
    "country": "United States",
    "description": "A4C is your one stop shop for all your cell phone accessories. A4C matches quality product with unbeatable prices, a popular combination with today's web-savvy consumers.",
    "from": "LINKSHARE"
  },
  {
    "id": 38268,
    "name": "JuiceBeauty.com",
    "url": "https://www.juicebeauty.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_38268.png",
    "country": "United States",
    "description": "Juice Beauty’s mission is to lead the industry with high efficacy and authentically organic beauty products while inspiring the ultimate customer experience.x0B",
    "from": "LINKSHARE"
  },
  {
    "id": 38469,
    "name": "HerbsPro",
    "url": "http://www.herbspro.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_38469.jpg",
    "country": "United States",
    "description": "HerbsPro.com is one of the world's largest and most comprehensive website on vitamins and herbal supplements, HerbsPro offers the widest range of  highest quality products from top name brands at unbeatable prices.",
    "from": "LINKSHARE"
  },
  {
    "id": 38664,
    "name": "BudgetPetCare",
    "url": "http://www.budgetpetcare.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_38664.jpg",
    "country": "United States",
    "description": "BudgetPetCare.com is a trusted online retailer of top quality brand name flea & tick treatments for cats & dogs at affordable prices. We offer great deals Frontline Plus, Nexgard, Heartgard Plus, Capstar, Revolution, Advantage Multi, Program Plus & More.",
    "from": "LINKSHARE"
  },
  {
    "id": 39670,
    "name": "Fred Meyer Jewelers",
    "url": "https://www.fredmeyerjewelers.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_39670.gif",
    "country": "United States",
    "description": "Fred Meyer Jewelers offers an extensive variety of quality fine jewelry, everything from engagement rings to brand name watches. We also offer unmounted diamonds, fashionable diamond and gemstone pieces and exclusive collections - all at a great value!",
    "from": "LINKSHARE"
  },
  {
    "id": 40099,
    "name": "MyUS.com",
    "url": "www.myus.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_40099.png",
    "country": "United States",
    "description": "As the proven industry leader and an unyielding advocate for its members, MyUS provides a reliable, secure and fast way to ship items from the US and the UK while maximizing your savings through package consolidation.",
    "from": "LINKSHARE"
  },
  {
    "id": 40214,
    "name": "Foreo",
    "url": "www.foreo.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_40214.png",
    "country": "United States",
    "description": "FOREO Sweden is taking the beauty industry by storm with its iconic new range of beauty solutions. The LUNA™ line of skincare devices and new ISSA™ line of dental beauty devices have already smashed the conventions of the health and beauty industry.",
    "from": "LINKSHARE"
  },
  {
    "id": 42946,
    "name": "What Goes Around Comes Around",
    "url": "WhatGoesAroundNYC.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_42946.jpg",
    "country": "United States",
    "description": "Since opening its New York flagship store in 1993, What Goes Around Comes Around has curated a global collection of the finest pre-owned luxury vintage handbags and jewelry from around the world.    ",
    "from": "LINKSHARE"
  },
  {
    "id": 43034,
    "name": "Dr Berg",
    "url": "https://shop.drberg.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_43034",
    "country": "United States",
    "description": "Get involved in an affiliate program that changes lives with super high quality content. The Dr. Berg affiliate program is a great way to bring visitors to your site and earn high commission on products millions of people need every day.",
    "from": "LINKSHARE"
  },
  {
    "id": 43381,
    "name": "Fox Rent a Car",
    "url": "https://www.foxrentacar.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_43381.png",
    "country": "United States",
    "description": "Fox Rent A Car has over 120 locations throughout the United States and popular International tourist destinations. You earn 5% commission on any reservation that results in an actual rental. The average bill on a car rental averages $200.00 USD.",
    "from": "LINKSHARE"
  },
  {
    "id": 43395,
    "name": "Blockchain Council",
    "url": "www.blockchain-council.org",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_43395.png",
    "country": "United States",
    "description": "Blockchain Council is an authoritative group of subject experts who are evangelizing Blockchain Research & Development, Use Cases and knowledge for the better world. We are an online education platform, educating people in Blockchain technology.",
    "from": "LINKSHARE"
  },
  {
    "id": 43570,
    "name": "Sonix",
    "url": "https://shopsonix.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_43570",
    "country": "United States",
    "description": "Based out of Los Angeles, Sonix specializes in tech accessories, sunglasses, stationery and small leather goods. ",
    "from": "LINKSHARE"
  },
  {
    "id": 44084,
    "name": "Beyond Polish",
    "url": "https://www.beyondpolish.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_44084.jpg",
    "country": "United States",
    "description": "Where beauty goes beyond the bottle. Made for the professional pampering your clients or a beauty enthusiast discovering your own look, Beyond Polish strives to become your desired destination for all of your beauty needs. ",
    "from": "LINKSHARE"
  },
  {
    "id": 44410,
    "name": "SOKO",
    "url": "https://shopsoko.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_44410.png",
    "country": "United States",
    "description": "Modern Fashion Jewelry, with social impact. Designed in San Francisco, handcrafted responsibly in Kenya. SOKO is redefining ethical fashion. ",
    "from": "LINKSHARE"
  },
  {
    "id": 45692,
    "name": "Carmen Sol",
    "url": "https://carmensol.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_45692.jpg",
    "country": "United States",
    "description": "Chic, eco-conscious, and affordable, Carmen Sol is reinventing the jelly as a lifestyle brand. The collection includes shoes, handbags, and accessories in 17 vivid colors with eco-friendly packaging.",
    "from": "LINKSHARE"
  },
  {
    "id": 45708,
    "name": "MyUS Shopping",
    "url": "https://shopping.myus.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_45708.png",
    "country": "United States",
    "description": "MyUS Shopping was created to eliminate the frustrations many global customers face when checking out on multiple US websites, as well as the high cost of shipping direct from stores. MyUS Shopping is backed by over 20 years of global eCommerce experience.",
    "from": "LINKSHARE"
  },
  {
    "id": 46068,
    "name": "IN COMMON Beauty",
    "url": "https://www.incommonbeauty.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_46068.jpg",
    "country": "United States",
    "description": "By joining the INCOMMON + Rakuten family, you will earn 20% commission on all orders. Our average order for INCOMMON Beauty is $70 USD. ",
    "from": "LINKSHARE"
  },
  {
    "id": 46304,
    "name": "VidDay",
    "url": "www.vidday.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_46304.jpg",
    "country": "United States",
    "description": "VidDay is a collaborative video maker for people who want to give a personalized gift.With VidDay, you can collect video messages and photos from friends to compile in a beautiful video. No editing skills required-VidDay makes the video for you! Try it!",
    "from": "LINKSHARE"
  },
  {
    "id": 46357,
    "name": "Bona Fide Masks",
    "url": "https://bonafidemasks.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_46357",
    "country": "United States",
    "description": "Bona Fide Masks® has one main objective: to help alleviate the shortage of personal protective equipment during any health emergency.",
    "from": "LINKSHARE"
  },
  {
    "id": 47210,
    "name": "Unstoppable Domains",
    "url": "https://unstoppabledomains.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_47210",
    "country": "United States",
    "description": "Unstoppable Domains is The #1 provider of NFT domains. With Unstoppable domains you don't have to worry about renewal fees, YOU OWN IT, FOR LIFE. Domains start at $5 and can range upwards of $100,000+! Join today",
    "from": "LINKSHARE"
  },
  {
    "id": 47519,
    "name": "Quicklly",
    "url": "https://www.quicklly.com",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_47519",
    "country": "United States",
    "description": "Quicklly provides a full digital presence for local businesses that offer Indian Groceries, Indian Food, Tiffins and Meal Baskets with same-day delivery option, connecting them to customers nationwide. We offer 10% Commission on all of our offerings.",
    "from": "LINKSHARE"
  },
  {
    "id": 47664,
    "name": "Boundr",
    "url": "https://boundr.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_47664",
    "country": "United States",
    "description": "Easily Send US Packages Internationally & Start Saving Today With Boundr. Send Packages Overseas to Your Family & Friends. Receive a Free Shipping Quote! Send Your Package Now. Upfront Prices.",
    "from": "LINKSHARE"
  },
  {
    "id": 47694,
    "name": "Event Tickets Center",
    "url": "https://www.eventticketscenter.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_47694",
    "country": "United States",
    "description": "At Event Tickets Center, we believe that buying tickets should be simple. From sports fanatics to music lovers and theater enthusiasts, ETC connects audiences nationwide with the tickets they need to create memories that will last a lifetime.",
    "from": "LINKSHARE"
  },
  {
    "id": 49336,
    "name": "Osaki Titan Massage Chair",
    "url": "https://clearancechair.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_49336",
    "country": "United States",
    "description": "Massage Chair Product | $100m Annual Wholesale | Top Brand Osaki Titan | $3m/per Affiliate Sales| USA Company | Texas HQ | Since 2007",
    "from": "LINKSHARE"
  },
  {
    "id": 50411,
    "name": "Hotel Collection",
    "url": "https://www.hotelcollection.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50411",
    "country": "United States",
    "description": "At Hotel Collection, we're dedicated to bringing the luxury of 5-star hotels to your home. Our range of fragrance and lifestyle products, including candles, diffusers, wines, and more, are all inspired by the world's most luxurious destinations.",
    "from": "LINKSHARE"
  },
  {
    "id": 50471,
    "name": "Bahia Verde Outdoors",
    "url": "https://bahiaverdeoutdoors.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50471",
    "country": "United States",
    "description": "Bahia Verde creates high-quality poly lumber furniture inspired by sandy shorelines, lighthouses & waterways. Proudly American-made, our eco-friendly process yields products that hold up for years, giving you a piece of paradise season after season.",
    "from": "LINKSHARE"
  },
  {
    "id": 50661,
    "name": "Conn's",
    "url": "https://www.conns.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50661",
    "country": "United States",
    "description": "Conn’s HomePlus is a specialty retailer of home goods, including furniture, appliances, and consumer electronics, based in The Woodlands, Texas, with a mission to elevate home life to home love.",
    "from": "LINKSHARE"
  },
  {
    "id": 50717,
    "name": "Nambe USA",
    "url": "https://www.nambe.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50717",
    "country": "United States",
    "description": "Nambé’s commitment to timeless beauty, artistic integrity and uncompromising quality is evident in the brand’s collection of serveware, barware, home décor and gift items. Nambé develops products that bring function and style into the home.",
    "from": "LINKSHARE"
  },
  {
    "id": 50719,
    "name": "Greg Norman Collection",
    "url": "https://gregnormancollection.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50719",
    "country": "United States",
    "description": "Built upon a unique combination of performance, luxury and style, Greg Norman Collection is a leading worldwide marketer of golf-inspired sportswear for men and women.",
    "from": "LINKSHARE"
  },
  {
    "id": 50730,
    "name": "Highwood USA",
    "url": "https://highwood-usa.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50730",
    "country": "United States",
    "description": "At Highwood USA, we provide Carefree Backyard Living with outdoor furniture crafted from premium, highly durable poly lumber. ",
    "from": "LINKSHARE"
  },
  {
    "id": 50744,
    "name": "Remodel Your Home",
    "url": "https://remodelyourhome.net/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50744",
    "country": "United States",
    "description": "Welcome to RemodelYourHome (RYH) Pay Per Lead Affiliate Program. Our Company helps homeowners to renovate and remodel their homes by providing them with the most affordable quotes of the best Contractors available in their area.",
    "from": "LINKSHARE"
  },
  {
    "id": 50832,
    "name": "Aroma360",
    "url": "https://aroma360.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_50832",
    "country": "United States",
    "description": "We blend high-quality oils to craft aromatic havens, harnessing natural therapeutic benefits. Elevate spaces, influence emotions, & harness the potency of scent – an underutilized yet potent tool.",
    "from": "LINKSHARE"
  },
  {
    "id": 52850,
    "name": "GiftYa",
    "url": "https://www.giftya.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_52850",
    "country": "United States",
    "description": "GiftYa® can be described as the Venmo of gifting, but with additional unique features.With it, you create a personalized “gift.” It’s never lost or stolen, it’s fraud-proof anddelivered via text in mere seconds.",
    "from": "LINKSHARE"
  },
  {
    "id": 53231,
    "name": "Bowlero",
    "url": "https://www.bowlero.com/",
    "imageUrl": "https://merchant.linksynergy.com/fs/logo/lg_53231",
    "country": "United States",
    "description": "Bowl. Party. Play at Bowlero, AMF or Lucky Strike! Epic Lanes, Eats & Games! Plan an Event or Reserve a Lane for Unforgettable Fun!",
    "from": "LINKSHARE"
  }
]`;
class MerchantService{

    async getAllMerchant(){
        // let FLEX_OFFER_API = `https://api.flexoffers.com/products/advertisers?page=1&pageSize=50`
        // let flexOfferHeader = {
        //     'apiKey':'41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7',
        //     'Content-Type': 'application/json'
        // }
        // const apiDataFlexOffer = await product.getAPI(FLEX_OFFER_API,flexOfferHeader,'JSON');
        // const responseData = [];
        // apiDataFlexOffer.forEach(advertiser=>{
        //     if(advertiser.country==='US'){
        //         const responseFormat = {
        //             'id':advertiser.aid,
        //             'name':advertiser.name,
        //             'url':advertiser.domainUrl,
        //             'imageUrl':advertiser.imageUrl,
        //             'description':advertiser.description,
        //             'country':advertiser.country,
        //             'from':'FLEXOFFER'
        //         }
        //         responseData.push(responseFormat);
        //     }
        // });

        // let linkSharePartnersAdvertisers = [];
        // let LINK_SHARE_PARTNER_LIST = 'https://api.linksynergy.com/linklocator/1.0/getMerchByAppStatus/';


        // let LINK_SHARE_merchant_list_API = `https://api.linksynergy.com/v2/advertisers?page=1&limit=200&ships_to=US&deep_links=true`;
        // let LINK_SHARE_MERCHANT_BY_ID = `https://api.linksynergy.com/v2/advertisers/`;
        // let linkShareHeader = {
        //     'Authorization':`Bearer ${await product.linkShareRefreshToken()}`,
        // }

        // const approvedPartners = await product.getAPI(LINK_SHARE_PARTNER_LIST+'approved',linkShareHeader,'XML');
        // const approvedExtendedPartners = await product.getAPI(LINK_SHARE_PARTNER_LIST+'approval extended ',linkShareHeader,'XML');
        // let approvedUpperLevel = approvedPartners['ns1:getMerchByAppStatusResponse'];
        // linkSharePartnersAdvertisers.push(...approvedUpperLevel['ns1:return']);
        // let approvedExtendedUpperLevel = approvedExtendedPartners['ns1:getMerchByAppStatusResponse'];
        // linkSharePartnersAdvertisers.push(...approvedExtendedUpperLevel['ns1:return']);
        // let merchantIdSet = new Set();
        // linkSharePartnersAdvertisers.forEach(merchant=>{
        //     let mid = merchant['ns1:mid'];
        //     merchantIdSet.add(mid[0]);
        // });

        //USE DEFINE LIST;
        // for (const value of merchantIdSet) {
        //     try {
        //         const advertiser = await product.getAPI(LINK_SHARE_MERCHANT_BY_ID+value, linkShareHeader, 'JSON');
        //         let country = advertiser.advertiser.contact.country;
        //         if(country==='United States' || country==='US'){
        //             const responseFormat = {
        //                 'id': advertiser.advertiser.id,
        //                 'name': advertiser.advertiser.name,
        //                 'url': advertiser.advertiser.url,
        //                 'imageUrl': advertiser.advertiser.profiles.logoURL,
        //                 'country': advertiser.advertiser.contact.country,
        //                 'description': advertiser.advertiser.description,
        //                 'from': 'LINKSHARE'
        //             };
        //             responseData.push(responseFormat);
        //         }
        //     } catch (error) {
        //         console.error(`Error fetching advertiser for merchantId ${value}:`, error.message);
        //     }
        // }

        // const apiMerchantLinkShare = await product.getAPI(LINK_SHARE_merchant_list_API,linkShareHeader,'JSON');
        // apiMerchantLinkShare.advertisers.forEach(advertiser=>{
        //     if(merchantIdSet.has(advertiser.id)){
                
        //     }
        // })

        // console.log(responseData);
        return JSON.parse(merchantList);
    }
}
module.exports = MerchantService;