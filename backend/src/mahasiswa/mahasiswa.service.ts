import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { Mahasiswa } from './entities/mahasiswa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kelas } from 'src/kelas/entities/kelas.entity';

@Injectable()
export class MahasiswaService {
  constructor(
    @InjectRepository(Mahasiswa)
    private mahasiswaRepository: Repository<Mahasiswa>,
    @InjectRepository(Kelas)
    private kelasRepository: Repository<Kelas>,
  ) {}

  async register(registerDto: CreateMahasiswaDto) {
    const mahasiswa = new Mahasiswa();
    mahasiswa.nama = registerDto.nama;
    mahasiswa.npm = registerDto.npm;
    mahasiswa.rfid_tag = registerDto.rfid_tag;
    mahasiswa.otp = registerDto.otp;

    console.log(registerDto.kelasIds);

    const kelas = await this.kelasRepository
      .createQueryBuilder('k')
      .where('k.id IN (:...kelasMahasiswa)', {
        kelasMahasiswa: registerDto.kelasIds,
      })
      .getMany();

    mahasiswa.kelas = kelas;
    try {
      await this.mahasiswaRepository.save(mahasiswa);
    } catch (error) {
      throw new HttpException(error['detail'], HttpStatus.BAD_REQUEST);
    }
    return this.mahasiswaRepository.findOneBy({ npm: mahasiswa.npm });
  }

  create(createMahasiswaDto: CreateMahasiswaDto) {
    return 'This action adds a new mahasiswa';
  }

  async findAll() {
    return await this.mahasiswaRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} mahasiswa`;
  }

  update(id: number, updateMahasiswaDto: UpdateMahasiswaDto) {
    return `This action updates a #${id} mahasiswa`;
  }

  remove(id: number) {
    return `This action removes a #${id} mahasiswa`;
  }
}
