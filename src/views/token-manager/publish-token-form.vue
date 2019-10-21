<template>
  <div class="publish-token-form">
    <el-form ref="form" :model="formParams">
      <el-form-item
        label="Select token logo (Upload PNG or JPG format. Maximum file size: 1M. Recommended size: 120*120KB )"
      >
        <el-upload
          action="http://178.128.221.42:8080/a/upload"
          class="avatar-uploader"
          name="upload"
          list-type="picture-card"
          :multiple="false"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :on-success="handleUploadSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="Token name">
        <el-input v-model="formParams.name" placeholder="Token full name. e.g. Ethereum"></el-input>
      </el-form-item>
      <el-form-item label="Token symbol">
        <el-input v-model="formParams.symbol" placeholder="Token name abbreviation. e.g. ETH"></el-input>
      </el-form-item>
      <el-form-item label="Total supply">
        <el-input v-model="formParams.supply" placeholder="Total supply"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "publish-token-form",
  data() {
    return {
      formParams: {
        logo: "",
        name: "",
        symbol: "",
        supply: ""
      }
    };
  },
  methods: {
    handleFileChange(file, fileList) {
      if (fileList.length === 1) {
        document.querySelector(".el-upload--picture-card").style.visibility =
          "hidden";
      }
    },
    handleFileRemove(file) {
      console.log("remove");
      document.querySelector(".el-upload--picture-card").style.visibility =
        "visible";
    },
    handleUploadSuccess(response, file, fileList) {
      this.formParams.logo = response.url;
    }
  }
};
</script>

<style lang="scss">
.publish-token-form {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>