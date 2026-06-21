export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
}

export interface Brand {
  brand: string;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;

  // ADD THESE (to remove hardcoding)
  address: string;
  state: string;
  city: string;
  zipcode: string;

}

export interface BaseResponse {
  responseCode: number;
  message: string;
}

export interface ProductsResponse extends BaseResponse {
  products: ReadonlyArray<Product>;
}

export interface BrandsResponse extends BaseResponse {
  brands: ReadonlyArray<Brand>;
}

export interface UserDetailResponse extends BaseResponse {
  user: {
    email: string;
  };
}