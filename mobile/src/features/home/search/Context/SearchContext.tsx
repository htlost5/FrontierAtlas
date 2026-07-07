// 検索機能用のReact Context: アプリ全体で検索テキストと結果を共有する状態管理
import React, { createContext, useContext, useState } from "react";

/**
 * SearchContextの状態型定義
 * @property searchText - ユーザーが入力した検索キーワード
 * @property setSearchText - 検索キーワードを更新する関数
 * @property answerText - 翻訳された検索結果（部屋名など）
 * @property setAnswerText - 検索結果を更新する関数
 */
type SearchContextType = {
  searchText: string;
  setSearchText: (text: string) => void;
  answerText: string;
  setAnswerText: (text: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// 検索ContextのProvider: 子コンポーネント全体に検索状態を提供するラッパー
/**
 * SearchContextプロバイダーコンポーネント
 * - 検索テキストと検索結果の状態を管理
 * - 子コンポーネントで useSearch() フックで使用可能
 * @param children - プロバイダーでラップするコンポーネント
 * @returns SearchContext.Providerでラップされたコンポーネント
 */
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchText, setSearchText] = useState("");
  const [answerText, setAnswerText] = useState("");
  return (
    <SearchContext.Provider
      value={{ searchText, setSearchText, answerText, setAnswerText }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// 検索Contextにアクセスするカスタムフック
/**
 * SearchContextの値を取得するカスタムフック
 * - SearchProvider配下のコンポーネントでのみ使用可能
 * - useSearch以外のコンポーネントで呼び出すとエラーを投げる
 * @returns SearchContextの値（searchText, setSearchText, answerText, setAnswerText）
 * @throws {Error} SearchProviderの外で呼び出された場合
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
