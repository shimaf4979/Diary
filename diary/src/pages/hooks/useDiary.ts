import { useState, useRef, useEffect } from "react";

type Entry = {
  title: string;
  content: string;
  date: Date | null;
};

type useDiaryProps = {
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDoen: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleContentKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleDateKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleFilterDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddEntry: () => void;
  handleEditEntry: (index: number) => void;
  handleDeleteEntry: (index: number) => void;
  title: string;
  content: string;
  filteredEntries: Entry[];
  error: string | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  dateInputRef: React.RefObject<HTMLInputElement>;
};

export const useDiary = (): useDiaryProps => {
  const [entryList, setEntryList] = useState<Entry[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  //変化を記録
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 日付を選択したときの処理
  const handleFilterDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value ? new Date(e.target.value) : null;
    setFilterDate(selectedDate);
  };

  //エンターを押したときの処理
  const handleKeyDoen = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!title) {
        setError("タイトルを入力してください");
        return;
      }
      textareaRef.current?.focus();
      setError(null);
    }
  };

  const handleContentKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!content) {
        setContent("");
        setError("本文を入力してください");
        return;
      }
      dateInputRef.current?.focus();
      dateInputRef.current?.showPicker();
      setError(null);
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const inputDate = new Date(e.currentTarget.value);
      setFilterDate(inputDate);
      handleAddEntry();
    }
  };

  //入力チェック
  const checkInputs = (): string | null => {
    switch (true) {
      case !dateInputRef.current?.value:
        return "日付を選択してください";
      case !title:
        return "タイトルを入力してください";
      case !content:
        return "本文を入力してください";
      default:
        return null;
    }
  };

  //エントリーを追加
  const handleAddEntry = () => {
    const error = checkInputs();
    if (error) {
      setError(error);
      return;
    }

    setError(null);
    const newEntry: Entry = {
      title,
      content,
      date: filterDate,
    };

    if (isEditing) {
      // 編集モードの場合、既存のエントリーを更新
      if (editDate !== filterDate) {
        // 日付が異なる場合、新しいエントリーを追加し、既存のエントリーを削除
        setEntryList((prev) => [
          ...prev.filter(
            (entry, index) =>
              !(
                index === editingIndex &&
                entry.date?.toLocaleDateString() ===
                  editDate?.toLocaleDateString()
              )
          ),
          newEntry,
        ]);
      } else {
        setFilteredEntries((prev: Entry[]) =>
          prev.map((entry, index) =>
            index === editingIndex
              ? { title, content, date: filterDate }
              : entry
          )
        );
        setIsEditing(false);
        setEditingIndex(null);
      }
    } else {
      // 新規追加モードの場合、新しいエントリーを追加
      setEntryList((prev) => [...prev, newEntry]);
    }

    // 入力フィールドをクリア
    // 入力フィールドをクリア
    setTitle("");
    setContent("");
    setFilterDate(null);
    setEditDate(null);
    if (dateInputRef.current) {
      dateInputRef.current.value = "";
      dateInputRef.current.showPicker();
    }
  };

  const handleEditEntry = (index: number) => {
    const entry = filteredEntries[index];
    setIsEditing(true);
    setTitle(entry.title);
    setContent(entry.content);
    setFilterDate(entry.date);
    setEditingIndex(index);
    setEditDate(entry.date);
  };

  const handleDeleteEntry = (index: number) => {
    setFilteredEntries((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const filteredEntries = filterDate
      ? entryList.filter(
          (entry) =>
            entry.date?.toLocaleDateString() ===
            filterDate?.toLocaleDateString()
        )
      : entryList;

    setFilteredEntries(filteredEntries);
  }, [filterDate, entryList]);

  //   const handleFilterEntries = useMemo(() => {
  //     filterDate
  //       ? entryList.filter(
  //           (entry) =>
  //             entry.date?.toLocaleDateString() ===
  //             filterDate?.toLocaleDateString()
  //         )
  //       : entryList;
  //   }, [filterDate, entryList]);

  return {
    handleChangeTitle,
    handleChangeContent,
    handleKeyDoen,
    handleContentKeyDown,
    handleDateKeyDown,
    handleFilterDate,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    title,
    content,
    filteredEntries,
    error,
    textareaRef,
    dateInputRef,
  };
};
