import SparkMD5 from "spark-md5";
const splitFile = (file: File, chunSize: number = 5 * 1024 * 1024) => {
  //返回一个promise
  return new Promise((resolve) => {
    //分片数量
    const chunkCount = Math.ceil(file.size / chunSize);
    //当前处理的chunk的下标
    let chunkIndex = 0;
    //创建SparkMD5实例 用于存储总文件的md5
    const spark = new SparkMD5.ArrayBuffer();
    //存放chunk的列表
    const chunkList: { id: string; content: Blob }[] = [];
    const fileReader = new FileReader();
    //获取下一个chunk的ArrayBuffer 的函数
    const getNextFileArrayBuffer = () => {
      //定义开始分片的位置与结束的位置
      const start = chunkIndex * chunSize;
      const end = Math.min(file.size, start + chunSize);
      //读取一部分的file 并转换为ArrayBuffer
      fileReader.readAsArrayBuffer(file.slice(start, end));
    };
    fileReader.onload = (e) => {
      const chunk = e.target!.result as ArrayBuffer;
      //把chunk的数据先推到spark中 因为要计算总文件的md5
      spark.append(chunk);
      //计算当前chunk的md5
      const currentChunkMd5 = SparkMD5.ArrayBuffer.hash(chunk);
      //id是当前chunk的md5 content是当前chunk的Blob（二进制数据）
      chunkList.push({
        id: currentChunkMd5,
        content: new Blob([chunk]),
      });
      chunkIndex++;
      if (chunkIndex < chunkCount) {
        //还有没处理完的分片 递归调用
        getNextFileArrayBuffer();
        return;
      }
      //全部处理完了
      const fileId = spark.end();
      const getFileExt = (fileName: string) => {
        const index = fileName.lastIndexOf(".");
        return index !== -1 ? fileName.substring(index + 1) : "";
      };
      resolve({
        fileId,
        chunkList,
        ext: getFileExt(file.name),
      });
    };

    getNextFileArrayBuffer();
  });
};
export default splitFile;
