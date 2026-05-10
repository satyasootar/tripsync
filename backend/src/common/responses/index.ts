import { StatusCodes } from "http-status-codes";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(data: T, message: string = "Success", statusCode: number = StatusCodes.OK) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(message: string = "Error", errors: any[] = [], statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    return {
      success: false,
      message,
      errors,
      statusCode,
    };
  }

  static paginated<T>(data: T[], pagination: Pagination, message: string = "Success") {
    return {
      success: true,
      message,
      data,
      pagination,
      statusCode: StatusCodes.OK,
    };
  }
}
