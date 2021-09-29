import { HttpException } from '@nestjs/common';
import { randomBytes } from 'crypto';

export function trimObj(obj: object) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') obj[key] = obj[key].trim();
  }
}

export function capitalizeFirstLetter(str: string) {
  trimObj({ str });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function validateCPF(cpf: string) {
  let sum = 0, rest = 0;

  cpf = cpf.replace(/[.-]/g, '').trim();

  switch (true) {
    case cpf === '00000000000':
    case cpf === '11111111111':
    case cpf === '22222222222':
    case cpf === '33333333333':
    case cpf === '44444444444':
    case cpf === '55555555555':
    case cpf === '66666666666':
    case cpf === '77777777777':
    case cpf === '88888888888':
    case cpf === '99999999999':
    case cpf.length !== 11:
      throw new HttpException("CPF inválido", 400);
    default:
      break;
  }

  for (let i = 1; i <= 9; i++) sum = sum + Number(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== Number(cpf.substring(9, 10))) throw new HttpException("CPF inválido", 400);

  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + Number(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== Number(cpf.substring(10, 11))) throw new HttpException("CPF inválido", 400);
}

export function createTokenHEX(size: number = 20) {
  return randomBytes(size).toString('hex');
}

export function validateCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[/\-.]/g, '').trim();

  switch (true) {
    case cnpj.length !== 14:
    case cnpj === "00000000000000":
    case cnpj === "11111111111111":
    case cnpj === "22222222222222":
    case cnpj === "33333333333333":
    case cnpj === "44444444444444":
    case cnpj === "55555555555555":
    case cnpj === "66666666666666":
    case cnpj === "77777777777777":
    case cnpj === "88888888888888":
    case cnpj === "99999999999999":
      throw new HttpException('CNPJ inválido', 400);
    default:
      break;
  }

  let v1 = 0, v2 = 0, aux = false;

  for (let i = 1; cnpj.length > i; i++) {
    if (cnpj[i - 1] !== cnpj[i]) aux = true;
  }

  if (!aux) throw new HttpException('CNPJ inválido', 400);

  for (let i = 0, p1 = 5, p2 = 13; (cnpj.length - 2) > i; i++, p1--, p2--) {
    if (p1 >= 2) {
      v1 += Number(cnpj[i]) * p1;
    } else {
      v1 += Number(cnpj[i]) * p2;
    }
  }

  v1 = (v1 % 11);

  if (v1 < 2) {
    v1 = 0;
  } else {
    v1 = (11 - v1);
  }

  if (v1 !== Number(cnpj[12])) throw new HttpException('CNPJ inválido', 400);

  for (let i = 0, p1 = 6, p2 = 14; (cnpj.length - 1) > i; i++, p1--, p2--) {
    if (p1 >= 2) {
      v2 += Number(cnpj[i]) * p1;
    } else {
      v2 += Number(cnpj[i]) * p2;
    }
  }

  v2 = (v2 % 11);

  if (v2 < 2) {
    v2 = 0;
  } else {
    v2 = (11 - v2);
  }

  if (v2 !== Number(cnpj[13])) throw new HttpException('CNPJ inválido', 400);
}

export function convertBool(value: string): boolean {
  const values = {
    'true': true,
    'false': false
  };

  return values[value];
}