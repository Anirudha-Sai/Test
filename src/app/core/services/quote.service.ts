import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  GeneratedQuoteResponseDto,
  Quote,
  QuoteCreateRequest,
  QuoteGenerationRequestDto,
  QuoteRequest,
  RiskAssessmentRequestDto
} from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/quotes`;

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}`);
  }

  getQuote(id: number | string): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }

  getQuoteRequests(): Observable<QuoteRequest[]> {
    return this.http.get<QuoteRequest[]>(`${this.apiUrl}/requests`);
  }

  getQuoteRequest(id: number | string): Observable<QuoteRequest> {
    return this.http.get<QuoteRequest>(`${this.apiUrl}/requests/${id}`);
  }

  getRequestQuotes(requestId: number | string): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}/requests/${requestId}/quotes`);
  }

  getQuotesForRequest(requestId: number | string): Observable<Quote[]> {
    return this.getRequestQuotes(requestId);
  }

  createQuoteRequest(payload: { propertyId?: number | string; requestedCoverage: number; requestedPremium: number; requestedPeriodYears: number; remarks?: string }): Observable<QuoteRequest> {
    return this.http.post<QuoteRequest>(`${this.apiUrl}/requests`, payload);
  }

  generateRiskAssessment(payload: RiskAssessmentRequestDto): Observable<GeneratedQuoteResponseDto> {
    return this.http.post<GeneratedQuoteResponseDto>(`${this.apiUrl}/generate`, payload);
  }

  generateQuotesForRequest(requestId: number | string, payload?: QuoteGenerationRequestDto | QuoteGenerationRequestDto[]): Observable<Quote[]> {
    const body = payload ?? {};
    return this.http.post<Quote[]>(`${this.apiUrl}/requests/${requestId}/generate`, body);
  }

  createQuote(payload: QuoteCreateRequest): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, payload);
  }

  updateQuote(id: number | string, payload: Partial<Quote>): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}/${id}`, payload);
  }

  selectQuote(id: number | string): Observable<Quote> {
    return this.http.post<Quote>(`${this.apiUrl}/${id}/select`, {});
  }

  approveQuote(id: number | string): Observable<Quote> {
    return this.http.post<Quote>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectQuote(id: number | string, reason: string): Observable<Quote> {
    const params = new HttpParams().set('reason', reason);
    return this.http.post<Quote>(`${this.apiUrl}/${id}/reject`, null, { params });
  }

  deleteQuote(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
