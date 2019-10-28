<template>
  <div class="publish-token-form">
    <el-form ref="tokenPublishForm" :rules="formRules" :model="formParams">
      <el-form-item
        label="Select token logo (Upload PNG or JPG format. Maximum file size: 1M. Recommended size: 120*120KB )"
        prop="icon"
      >
        <br />
        <el-upload
          class="icon-uploader"
          action="http://178.128.221.42:8080/a/upload"
          accept=".jpg, .jpeg, .png, .PNG, .JPG, .JPEG"
          :multiple="false"
          name="upload"
          :show-file-list="false"
          list-type="picture-card"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formParams.icon" :src="formParams.icon" class="icon-view" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="Token name" prop="name">
        <el-input
          v-model="formParams.name"
          class="input-width"
          placeholder="Token full name. e.g. Ethereum"
        ></el-input>
      </el-form-item>
      <el-form-item label="Token symbol" prop="symbol">
        <el-input
          v-model="formParams.symbol"
          class="input-width"
          placeholder="Token name abbreviation. e.g. ETH"
        ></el-input>
      </el-form-item>
      <el-form-item label="Total supply" prop="supply">
        <el-input v-model.number="formParams.supply" class="input-width" placeholder="Total supply"></el-input>
      </el-form-item>
      <el-button class="btn-main btn-width" @click="submitForm('tokenPublishForm')" round>Publish</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "publish-token-form",
  data() {
    return {
      imageUrl: "",
      formParams: {
        icon: "",
        name: "Hello",
        symbol: "HLO",
        supply: 20000
      },
      formRules: {
        icon: [
          {
            required: true,
            message: "Please upload token logo",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "Please input token name",
            trigger: "blur"
          }
        ],
        symbol: [
          {
            required: true,
            message: "Please input token symbol",
            trigger: "blur"
          }
        ],
        supply: [
          {
            required: true,
            message: "Please input token supply",
            trigger: "blur"
          },
          { type: "number", message: "supply must be a number" }
        ]
      }
    };
  },
  methods: {
    checkInput(rule, value, callback) {
      var regp =/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/;
      if (!regp.test(value)) {
        return callback(new Error("Only support letter and number"));
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
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
      this.formParams.icon = response.url;
      this.$refs.tokenPublishForm.validateField("icon");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('clickPublish', this.formParams);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.publish-token-form {
  .icon-view {
    border-radius: 50%;
    height: 72px;
    width: 72px;
    overflow: hidden;
  }
  .icon-uploader {
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
  }
  .input-width {
    width: 480px;
    display: block;
  }
  .btn-width {
    width: 144px;
    margin-top: 14px;
  }
}
</style>