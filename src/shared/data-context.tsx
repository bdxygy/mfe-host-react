import React, { ReactNode, useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { FC } from "react";
import { createContext } from "react";

export type ServerContextDataT = {
  _isServerSide?: boolean;
  _requests?: (() => Promise<void>)[];
  _data?: Record<string, any>;
};

const DataContext = createContext<Record<string, any> | ServerContextDataT>({});

export const useServer = (id: string, fetcher: () => Promise<any>) => {
  const context = useContext(DataContext);

  const [response, setResponse] = useState<Record<string, any>>(
    context._data[id] || null
  );

  useEffect(() => {
    if (!typeof document || context._isServerSide) return;
    fetcher().then((response) => {
      setResponse(response);
      context._data[id] = response;
    });
  }, []);

  if (context?._isServerSide) {
    context._requests.push(
      fetcher().then((response) => {
        context._data[id] = response;
      })
    );
  } else if (!response) {
    fetcher().then((response) => {
      setResponse(response);
      context._data[id] = response;
    });
  }

  return { ready: !context._isServerSide, data: response };
};

export const DataContextProvider: FC<{
  children: ReactNode;
  value: Record<string, any>;
}> = ({ children, value }) => {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
