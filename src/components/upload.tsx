import { Button, Progress } from "antd";
import "./index.less";
import { useRef, useState } from "react";
import splitFile from "./splitFile";
interface FileInfo {
  fileId: string;
  chunkList: {
    id: string;
    content: Blob;
  }[];
  ext: string;
}
const Upload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInfo = useRef<FileInfo>(null);
  const [hasFile, setHasFile] = useState(false);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (!e.target.files?.[0]) {
      return;
    }
    const res = await splitFile(e.target.files[0]);
    console.log(res);
  };
  return (
    <div className="upload">
      <div className="content">
        <Button
          className="btn"
          size="large"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          选择文件
        </Button>
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        <Progress className="progress" percent={30} />
      </div>
    </div>
  );
};

export default Upload;
