import { request, APIRequestContext, APIResponse } from '@playwright/test';
import {ProductsResponse,BrandsResponse,BaseResponse,UserDetailResponse} from '../types/apiTypes';

export class ApiClient {
  private context!: APIRequestContext;

  // INIT (ENV BASED)
  
  async init(): Promise<void> {
    const rawBaseURL = process.env.API_BASE_URL;

    if (!rawBaseURL) {
      throw new Error('❌ API_BASE_URL is not defined in .env');
    }

    const baseURL = rawBaseURL.replace(/\/+$/g, '') + '/';

    this.context = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  
  // GENERIC METHODS (REUSABLE)

  private normalizeEndpoint(endpoint: string): string {
    return endpoint.replace(/^\/+/g, '');
  }

  private async getRequest(endpoint: string): Promise<APIResponse> {
    return this.context.get(this.normalizeEndpoint(endpoint));
  }

  private async postRequest(
    endpoint: string,
    formData?: Record<string, string>
  ): Promise<APIResponse> {
    return this.context.post(this.normalizeEndpoint(endpoint), {
      form: formData
    });
  }

  private async putRequest(
    endpoint: string,
    formData?: Record<string, string>
  ): Promise<APIResponse> {
    return this.context.put(this.normalizeEndpoint(endpoint), {
      form: formData
    });
  }

  private async deleteRequest(
    endpoint: string,
    formData?: Record<string, string>
  ): Promise<APIResponse> {
    return this.context.delete(this.normalizeEndpoint(endpoint), {
      form: formData
    });
  }

  // RESPONSE PARSER (STRICT TYPE)
  

  private async parseResponse<T>(response: APIResponse): Promise<T> {
    const body = await response.json();

    // Optional: add runtime validation if needed
    return body as T;
  }

  // API METHODS (TYPED)
  

  // API-001
  async getProducts(): Promise<ProductsResponse> {
    const response = await this.getRequest('/productsList');
    return this.parseResponse<ProductsResponse>(response);
  }

  // API-003
  async getBrands(): Promise<BrandsResponse> {
    const response = await this.getRequest('/brandsList');
    return this.parseResponse<BrandsResponse>(response);
  }

  // API-005 / API-006
  async searchProduct(keyword: string): Promise<ProductsResponse> {
    const response = await this.postRequest('/searchProduct', {
      search_product: keyword
    });

    return this.parseResponse<ProductsResponse>(response);
  }

  // API-006 (missing param)
  async searchProductWithoutParam(): Promise<BaseResponse> {
    const response = await this.postRequest('/searchProduct');
    return this.parseResponse<BaseResponse>(response);
  }

  // API-002 (invalid POST)
  async invalidPostProducts(): Promise<BaseResponse> {
    const response = await this.postRequest('/productsList');
    return this.parseResponse<BaseResponse>(response);
  }

  // API-004 (invalid PUT)
  async invalidPutBrands(): Promise<BaseResponse> {
    const response = await this.putRequest('/brandsList');
    return this.parseResponse<BaseResponse>(response);
  }

  
  // USER LIFECYCLE (API-007)
 

  async createUser(data: Record<string, string>): Promise<BaseResponse> {
    const response = await this.postRequest('/createAccount', data);
    return this.parseResponse<BaseResponse>(response);
  }

  async updateUser(data: Record<string, string>): Promise<BaseResponse> {
    const response = await this.putRequest('/updateAccount', data);
    return this.parseResponse<BaseResponse>(response);
  }

  async getUser(email: string): Promise<UserDetailResponse> {
    const response = await this.getRequest(
      `/getUserDetailByEmail?email=${email}`
    );
    return this.parseResponse<UserDetailResponse>(response);
  }

  async deleteUser(email: string): Promise<BaseResponse> {
    const response = await this.deleteRequest('/deleteAccount', {
      email
    });
    return this.parseResponse<BaseResponse>(response);
  }

  
  // LOGIN (API-008)


  async verifyLogin(data: Record<string, string>): Promise<BaseResponse> {
    const response = await this.postRequest('/verifyLogin', data);
    return this.parseResponse<BaseResponse>(response);
  }

  // PUBLIC GENERIC HTTP METHODS
  async get(endpoint: string): Promise<APIResponse> {
    return this.getRequest(endpoint);
  }

  async post(endpoint: string, body: Record<string, string> = {}): Promise<APIResponse> {
    return this.postRequest(endpoint, body);
  }

  async put(endpoint: string, body: Record<string, string> = {}): Promise<APIResponse> {
    return this.putRequest(endpoint, body);
  }

  async delete(endpoint: string, body: Record<string, string> = {}): Promise<APIResponse> {
    return this.deleteRequest(endpoint, body);
  }
}