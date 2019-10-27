<template>
  <div class="publish-token-form">
    <el-form ref="form" :model="formParams">
      <el-form-item
        label="Select token logo (Upload PNG or JPG format. Maximum file size: 1M. Recommended size: 120*120KB )"
      >
        <br />
        <el-upload
          action="http://178.128.221.42:8080/a/upload"
          class="icon-uploader"
          name="upload"
          list-type="picture-card"
          accept=".jpg, .jpeg, .png, .PNG, .JPG, .JPEG"
          :multiple="false"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="Token name">
        <el-input
          v-model="formParams.name"
          class="input-width"
          placeholder="Token full name. e.g. Ethereum"
        ></el-input>
      </el-form-item>
      <el-form-item label="Token symbol">
        <el-input
          v-model="formParams.symbol"
          class="input-width"
          placeholder="Token name abbreviation. e.g. ETH"
        ></el-input>
      </el-form-item>
      <el-form-item label="Total supply">
        <el-input v-model="formParams.supply" class="input-width" placeholder="Total supply"></el-input>
      </el-form-item>
      <el-button class="btn-main btn-width" round>Publish</el-button>
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
      document.querySelector(".el-upload--picture-card").style.visibility =
        "visible";
      this.formParams.logo = "";
    },
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isLt1M) {
        this.$message.error("Picture size can not exceed 1MB!");
      }
      return isLt1M;
    },
    handleUploadSuccess(response, file, fileList) {
      this.formParams.logo = response.url;
    }
  }
};
</script>

<style lang="scss">
.publish-token-form {
  .input-width {
    width: 480px;
    display: block;
  }
  .btn-width {
    width: 144px;
    margin-top: 14px;
  }
  .icon-uploader {
    // margin-top: -20px;
    // margin-bottom: 20px;
    display: block;
    .el-upload--picture-card {
      border-radius: 50%;
      height: 72px;
      width: 72px;
      line-height: 77px;
      background: #cbced7;
      border: none;
    }

    .el-icon-plus:before {
      color: #fff;
      font-size: bold;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      border-radius: 50%;
      height: 72px;
      width: 72px;
      overflow: hidden;
    }

    .el-upload-list__item is-success {
      border-radius: 50%;
      height: 72px;
      width: 72px;
      overflow: hidden;
    }
  }
}
</style>