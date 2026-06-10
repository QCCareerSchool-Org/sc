import type { Metadata, ResolvingMetadata } from 'next';
import type { NextRequest, NextResponse } from 'next/server';
import type { FC, ReactNode } from 'react';

type EmptyRecord = Record<never, string>;

export interface PageProps<RouteParams extends Record<string, string> = EmptyRecord> {
  params: Promise<RouteParams>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type LayoutProps<RouteParams extends Record<string, string> = EmptyRecord> = Readonly<{
  children: ReactNode;
  params: Promise<RouteParams>;
}>;

export type PageComponent<RouteParams extends Record<string, string> = EmptyRecord> = FC<PageProps<RouteParams>>;

export type LayoutComponent<RouteParams extends Record<string, string> = EmptyRecord> = FC<LayoutProps<RouteParams>>;

export type GenerateMetadata<RouteParams extends Record<string, string> = EmptyRecord> = (props: PageProps<RouteParams>, parent: ResolvingMetadata) => Promise<Metadata>;

export type RouteHandler<T = Record<string, string>> = (request: NextRequest, context: { params: T }) => Promise<Response | NextResponse> | Response | NextResponse;
