/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {

    return this.products.create({
        data: createProductDto
      })
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;
    const totalItems = await this.products.count({
      where: { isActive: true }
    });
    const pageView = (page - 1) * limit
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: await this.products.findMany({
        take: limit,
        skip: pageView,
        where: { isActive: true }
      }),
      meta: {
        totalItems: totalItems,
        totalPages: totalPages,
        page: page
      }
    }
  }

  async findOne(id: number) {
   const product = await this.products.findFirst({
    where: { id, isActive: true }
   })

   if(!product){
    throw new NotFoundException(`Product with id ${id} not found`);
  }
   return product;

    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id: __, ...restoData} = updateProductDto;

    await this.findOne(id);

    return await this.products.update({
      where: { id },
      data: restoData
    });
    
  }

  async remove(id: number) {
    await this.findOne(id);

    //return await this.products.delete({
    //      where: { id }  
    //});

    const product = await this.products.update({
      where: { id },
      data: { 
        isActive: false
       }
    });
    return product;
  }
}
