import Button from "../../components/common/parts/Button";
import { useDiary } from "./hooks/useDiary";

export const Home = () => {
  const {
    handleChangeTitle,
    handleChangeContent,
    handleKeyDoen,
    handleContentKeyDown,
    handleDateKeyDown,
    handleFilterDate,
    handleAddEntry,
    handleEditEntry,
    handleDeleteEntry,
    error,
    title,
    content,
    filteredEntries,
    textareaRef,
    dateInputRef,
  } = useDiary();

  return (
    <div className='mx-auto mt-8 max-w-4xl'>
      <div className='flex justify-center'>
        <div className='flex w-80 flex-col gap-4'>
          <h2 className='text-2xl font-bold'>日記アプリ</h2>

          {/* タイトルコンテンツの入力フォーム */}
          <div>
            {error && <p className='text-red-500'>{error}</p>}
            <input
              type='text'
              className='w-full border px-3 py-2 outline-none'
              placeholder='タイトルを入力'
              value={title}
              onChange={handleChangeTitle}
              onKeyDown={handleKeyDoen}
            />
          </div>
          <textarea
            ref={textareaRef}
            className='w-full border px-3 py-2 outline-none'
            placeholder='本文を入力'
            value={content}
            onChange={handleChangeContent}
            onKeyDown={handleContentKeyDown}
          ></textarea>

          <div className='mt-4 flex justify-center'>
            <Button
              variant='primary'
              className='inline-block'
              label='追加'
              onClick={handleAddEntry}
            />
          </div>

          {/* 日付フィルター */}
          <div className='mt-4 flex items-center justify-center gap-2'>
            <span className='text-base'>日付フィルター</span>
            <input
              ref={dateInputRef}
              type='date'
              className='rounded-md border px-3 py-2 outline-none'
              placeholder='日付を選択'
              onChange={handleFilterDate}
              onKeyDown={handleDateKeyDown}
            />
          </div>

          {/* 日記一覧 */}
          <div className='mt-4'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-xl font-bold'>日記一覧</h2>
              <div className='flex items-center justify-between'>
                <ul className='w-full'>
                  {filteredEntries.map((entry, index) => (
                    <li
                      key={index}
                      className='mt-4  rounded-md border text-center'
                    >
                      <h3 className='text-lg font-bold'>{entry.title}</h3>
                      <p className='p-3 text-left text-sm'>{entry.content}</p>
                      <div className='mb-4 mt-8 flex items-center justify-center gap-4'>
                        <Button
                          variant='secondary'
                          label='編集'
                          onClick={() => handleEditEntry(index)}
                          className='h-full'
                        />
                        <p className='text-sm'>
                          {entry.date?.toLocaleDateString()}
                        </p>

                        <Button
                          variant='secondary'
                          label='削除'
                          onClick={() => handleDeleteEntry(index)}
                          className='h-full '
                        />
                      </div>
                      {/* {Dateは直接扱うことができない→stringに変換する} */}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
