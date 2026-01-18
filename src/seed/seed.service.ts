import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts() {
    const count = await this.productsRepository.count();

    if (count === 0) {
      const products = [
        {
          name: 'Jollibee Chickenjoy Bucket',
          description: 'Classic Filipino crispy chicken with gravy - 8 pieces',
          price: 499.0,
          stock: 30,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG8bDs860Y2UFcIxQzKRyTNXIwCsfWKMLBmg&s',
        },
        {
          name: 'Mang Tomas All-around Sarsa',
          description: 'Classic Filipino lechon sauce - 325g bottle',
          price: 89.75,
          stock: 100,
          imageUrl:
            'https://pagbilan.co.uk/wp-content/uploads/2024/06/IMG_8447.webp',
        },
        {
          name: 'Barong Tagalog',
          description: 'Traditional Filipino formal wear for men - Medium size',
          price: 1299.99,
          stock: 25,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-XsdNumwaPQmsap5vjEMzjIl6Ujuy0GExQ&s',
        },
        {
          name: 'Samsung A15 5G',
          description: 'Latest Samsung smartphone with 128GB storage',
          price: 8499.0,
          stock: 15,
          imageUrl:
            'https://images.samsung.com/is/image/samsung/p6pim/ph/sm-a156ezbdphl/gallery/ph-galaxy-a15-5g-sm-a156-sm-a156ezbdphl-thumb-539370461',
        },
        {
          name: 'Kape Barako Beans',
          description: 'Premium Batangas Liberica coffee beans - 250g',
          price: 349.5,
          stock: 50,
          imageUrl: 'https://assets.unileversolutions.com/v1/132211020.jpg',
        },
        {
          name: 'CDO funtastyk',
          description: 'Young pork tocino - Family pack 450g',
          price: 299.0,
          stock: 40,
          imageUrl:
            'https://www.cdo.com.ph/wp-content/uploads/2022/05/Funtastyk-pork-tocino-450g-digital-mockup.png',
        },
        {
          name: 'Nike Running Shoes',
          description: 'Air Max 270 React - Size 9',
          price: 5499.0,
          stock: 12,
          imageUrl:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        },
        {
          name: 'Chocnut Box',
          description:
            'Classic Filipino chocolate peanut candy - Box of 24 packs',
          price: 149.0,
          stock: 80,
          imageUrl:
            'https://ever.ph/cdn/shop/files/100000007341-Chocnut-Milk-Choco-King-200g-200909_15dcb519-c0b4-4f3d-92bc-fe7dbdc80202.jpg?v=1762137196',
        },
        {
          name: 'Mikasa Volleyball',
          description: 'Official game volleyball - Made in the Philippines',
          price: 1899.0,
          stock: 20,
          imageUrl:
            'https://shop.volleyballworld.com/cdn/shop/files/V200W-WVH25_PH_-1000pix-Front_1800x1800.png?v=1751551454',
        },
        {
          name: 'UFC Banana Ketchup',
          description: 'UFC Banana Catsup Tamis Anghang 320g',
          price: 45.5,
          stock: 120,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5gPcVU_vQ5XIEsAmTYGrL2puxKt_plGI2A&s',
        },
        {
          name: 'Sinigang Mix',
          description: 'Tamarind soup mix - Pack of 10 sachets',
          price: 89.0,
          stock: 60,
          imageUrl: 'https://assets.unileversolutions.com/v1/1648400.png',
        },
        {
          name: 'Mango Float Ingredients Kit',
          description:
            'Complete ingredients for making mango float - Serves 8-10',
          price: 399.0,
          stock: 25,
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx5LAvcrFuEWUX1v5pS9I_3kAsnT-sPPJtNA&s',
        },
      ];

      for (const productData of products) {
        const product = this.productsRepository.create(productData);
        await this.productsRepository.save(product);
      }

      console.log('Database seeded with Filipino products');
    }
  }
}
